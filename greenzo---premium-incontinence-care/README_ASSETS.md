# 资源管理说明 (Asset Management Guide)

本网站的所有图片和视频资源都集中在 `src/assets.ts` 中管理。这样做是为了方便您后续自行替换和扩展。

## 1. 如何替换现有资源
打开 `src/assets.ts`，您会看到如下结构：

- `hero`: 首页顶部的大图。
- `products`: 对应三个核心产品的展示图。
- `gallery`: 画廊相册的图片列表。
- `brand`: 品牌故事部分的配图。
- `videos`: 视频封面图及视频链接。

您只需要将里面的 URL 替换为您自己的图片链接即可。

## 2. 如何添加更多画廊图片
在 `gallery` 数组中添加新的字符串链接即可。例如：

```typescript
gallery: [
  "图片1.jpg",
  "图片2.jpg",
  "图片3.jpg", // 新增
]
```
网页会自动根据数量生成对应的格子。

## 3. 使用本地图片
如果您想使用本地存放的图片：
1. 在项目根目录创建 `public` 文件夹（如果还没有的话）。
2. 在 `public` 下创建 `images` 文件夹，放入您的图片。
3. 在 `src/assets.ts` 中，路径写成 `/images/您的图片名.jpg`。

## 4. 视频说明
目前视频部分使用了占位图。您可以在 `videos.mainDemo.url` 中填入您的视频文件路径（如 `/videos/product-demo.mp4`）或视频平台的嵌入链接。
