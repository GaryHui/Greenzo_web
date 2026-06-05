param(
  [string]$SourceDir = "src/photo/24",
  [int]$MaxBytes = 100000
)

Add-Type -AssemblyName System.Drawing

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" } |
  Select-Object -First 1

if (-not $jpegCodec) {
  throw "JPEG encoder is not available on this machine."
}

$resolvedSourceDir = Resolve-Path -LiteralPath $SourceDir
$images = Get-ChildItem -LiteralPath $resolvedSourceDir -Filter "*.png" |
  Sort-Object { [int]$_.BaseName }

foreach ($file in $images) {
  $source = [System.Drawing.Image]::FromFile($file.FullName)
  try {
    $targetPath = Join-Path $file.DirectoryName "$($file.BaseName).jpg"
    $bestBytes = $null
    $bestLength = [int64]::MaxValue
    $bestWidth = 0
    $bestQuality = 0
    $written = $false

    foreach ($width in @(760, 720, 680, 640, 600, 560, 520, 480)) {
      if ($written) { break }
      $height = [int][Math]::Round($source.Height * ($width / $source.Width))
      $bitmap = New-Object System.Drawing.Bitmap $width, $height
      try {
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
          $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
          $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
          $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
          $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
          $graphics.Clear([System.Drawing.Color]::White)
          $graphics.DrawImage($source, 0, 0, $width, $height)
        } finally {
          $graphics.Dispose()
        }

        foreach ($quality in @(78, 74, 70, 66, 62, 58, 54, 50, 46, 42, 38)) {
          $qualityParam = New-Object System.Drawing.Imaging.EncoderParameter `
            ([System.Drawing.Imaging.Encoder]::Quality), ([int64]$quality)
          $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
          $encoderParams.Param[0] = $qualityParam
          $stream = New-Object System.IO.MemoryStream
          try {
            $bitmap.Save($stream, $jpegCodec, $encoderParams)
            $length = $stream.Length
            if ($length -lt $bestLength) {
              $bestBytes = $stream.ToArray()
              $bestLength = $length
              $bestWidth = $width
              $bestQuality = $quality
            }
            if ($length -le $MaxBytes) {
              [System.IO.File]::WriteAllBytes($targetPath, $stream.ToArray())
              $kb = [Math]::Round($length / 1KB, 1)
              Write-Output "$($file.Name) -> $($file.BaseName).jpg ${kb}KB ${width}w q${quality}"
              $written = $true
              break
            }
          } finally {
            $stream.Dispose()
            $encoderParams.Dispose()
            $qualityParam.Dispose()
          }
        }
      } finally {
        $bitmap.Dispose()
      }
    }

    if (-not $written) {
      [System.IO.File]::WriteAllBytes($targetPath, $bestBytes)
      $kb = [Math]::Round($bestLength / 1KB, 1)
      Write-Output "$($file.Name) -> $($file.BaseName).jpg ${kb}KB ${bestWidth}w q${bestQuality}"
    }
  } finally {
    $source.Dispose()
  }
}
