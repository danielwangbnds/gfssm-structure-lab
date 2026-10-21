# Asset sources and research

核查及下载日期：2026-10-21。没有使用付费模型、抓取的游戏资产、无许可图片或远程字体。

## 已集成的 3D 素材

### International Space Station (ISS) (B)

- 作者 / 提供方：NASA / Michael D. Carbajal。
- 原始页面：https://science.nasa.gov/3d-resources/international-space-station-iss-b/
- 官方镜像：https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/International%20Space%20Station%20(ISS)%20(B)
- 下载：https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/international-space-station-%28iss%29-%28b%29/International%20Space%20Station%20%28ISS%29%20%28B%29.glb
- 本地文件：`public/assets/iss-nasa.glb`，476,992 bytes，原始下载未改写。
- SHA-256：`2ba4427413b0dd89a33d2acaf962dea8a96a3b1d8dceda05cc7aad547ffd3d16`。
- 许可依据：[NASA 3D Resources](https://science.nasa.gov/3d-resources/) 明确提供免费下载与使用，并指向 [NASA Images and Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/)。后者允许合规的教育和信息用途，要求承认 NASA 来源，不得暗示背书；第三方版权标记需单独处理。此资源页面标注 NASA / Michael D. Carbajal，未列出第三方版权限制。
- 用途：侧栏「真实航天器参考」的可旋转 3D 观察示例；不替代任何核心教学模型，不计入参数化练习。
- 适配：只在运行时克隆中移除七个悬空辅助节点（`bendedtru1/2/3`、`bendedtrus`、`pCylinder1/2/8`），保留 `polySurfa1/2/3` 主体；调整展示朝向；给 `lambert7SG.001` 太阳能阵列材质增加蓝色以便区分。几何和配色适配不是 NASA 的教学结论。弹窗公开说明显示和配色经过调整。
- 性能：原始 Draco 压缩 GLB 约 466 KiB，无外部纹理或 buffer URL；参考功能按需加载。主教学查看器像素比上限 1.75，参考查看器上限 1.5。
- 模型署名在参考弹窗和 `public/assets/ISS_CREDITS.txt` 中展示。没有使用 NASA 标志作为本站品牌，也没有表示 NASA 背书。

### Draco decoder

- 作者：Google / Draco contributors。
- 原始项目：https://github.com/google/draco
- 许可：Apache-2.0，完整文本在 `public/assets/draco/LICENSE.txt`。
- 文件来自已安装 Three.js 0.180.0 的 `examples/jsm/libs/draco/gltf/`，原样复制三个解码文件，未包含编码器。
- 用途：本地解码 NASA GLB。`useGLTF` 的 decoder path 显式指向本站，避免依赖外部 CDN。

### IBM Plex Mono Regular

- 作者：IBM Corp. / IBM Plex contributors。
- 原始来源：https://github.com/google/fonts/tree/main/ofl/ibmplexmono ，上游 https://github.com/IBM/plex 。
- 许可：SIL Open Font License 1.1（Reserved Font Name: Plex），完整原文保存在 `public/assets/fonts/OFL.txt`。
- 本地文件：`public/assets/fonts/IBMPlexMono-Regular.ttf`，原样下载，未修改字体或单独销售。
- 用途：Drei Text 原生 3D 尺寸与平面标注，不依赖 HTML 独立根节点。配合 ScreenSizer / Billboard 保持可读字号和面向镜头，避免频繁切换任务时的 DOM 卸载冲突。

## 复用的软件与 UI 组件

| 资源 | 原始 URL | 作者 | 许可 | 使用位置 |
| --- | --- | --- | --- | --- |
| Three.js 0.180.0 | https://github.com/mrdoob/three.js | Three.js authors | MIT | 全部真实几何、材质、灯光；LatheGeometry、ExtrudeGeometry、BufferGeometryUtils |
| React Three Fiber 9.8.2 | https://github.com/pmndrs/react-three-fiber | Paul Henschel / Poimandres contributors | MIT | React 与 WebGL 场景生命周期集成 |
| Drei 10.7.9 | https://github.com/pmndrs/drei | Poimandres / react-spring contributors | MIT | OrbitControls、Grid、GizmoHelper、GizmoViewport、Line、Edges、Text、ScreenSizer、Billboard；参考模型 Bounds、Center、useGLTF |
| three-stdlib 2.36.1 | https://github.com/pmndrs/three-stdlib | Poimandres / Three.js contributors | MIT | Drei 复用的 Three.js controls / loader 实现及控制器类型 |
| Motion / Framer Motion 12.43.0 | https://github.com/motiondivision/motion | Framer B.V. / Motion contributors | MIT | 教程切换、提示反馈的轻量过渡 |
| Lucide React 0.468.0 | https://github.com/lucide-icons/lucide | Lucide Contributors；部分来自 Cole Bemis / Feather | ISC，含源项目 MIT 声明 | 导航、工具条、提示图标 |
| React / React DOM 19.3.1 | https://github.com/facebook/react | Meta Platforms, Inc. and affiliates | MIT | 应用界面与状态管理 |
| Vite / TypeScript | https://github.com/vitejs/vite / https://github.com/microsoft/TypeScript | Vite contributors / Microsoft | MIT / Apache-2.0 | 开发服务、类型检查与生产构建 |

直接与传递依赖的实际版权文本根据安装的包生成在 `public/licenses/THIRD_PARTY_NOTICES.txt`，随生产构建复制。R3F npm 包没有携带 LICENSE 文件，其官方 MIT 原文另存 `public/licenses/react-three-fiber.txt`。更新依赖后运行 `pnpm notices` 更新汇总。查看 `pnpm-lock.yaml` 获取精确版本。

## 教学与交互调研（参考，不复制文章或网站素材）

| 资源 | URL | 作者 / 权利方 | 许可 / 使用方式 | 对本项目的用途 |
| --- | --- | --- | --- | --- |
| Extrude a solid body | https://help.autodesk.com/view/fusion360/ENU/?contextId=SLD-EXTRUDE-SOLID | Autodesk | 文档版权归 Autodesk；只核对命令概念，使用原创中文教程，没有复制截图或文章 | 核对 New Body / Join / Cut、Distance / All 与轮廓选择 |
| OrbitControls | https://threejs.org/docs/pages/OrbitControls.html | Three.js authors | MIT 实现；调用已安装库 | 直接复用 Orbit / Pan / Zoom，配置鼠标按钮与阻尼 |
| Grid | https://drei.docs.pmnd.rs/gizmos/grid | Poimandres | MIT 实现；调用已安装库 | 网格参数与 y-up → z-up 朝向 |
| GizmoHelper | https://drei.docs.pmnd.rs/gizmos/gizmo-helper | Poimandres | MIT 实现；调用已安装库 | 相机导航组件、makeDefault controls 集成 |
| BufferGeometryUtils | https://threejs.org/docs/pages/module-BufferGeometryUtils.html | Three.js authors | MIT 实现；调用已安装库 | 使用 toCreasedNormals 保持舱体边缘清晰、曲面平滑 |
| GLTFLoader example | https://threejs.org/examples/webgl_loader_gltf | Three.js authors | MIT 实现；参考加载流程，实际复用 Drei loader | 检查 glTF / GLB 场景加载方案 |
| Eyes on the Solar System | https://eyes.nasa.gov/apps/solar-system/ | NASA / JPL | 仅作为公开交互界面参考，没有复制代码、图片或品牌 | 大画布、克制叠加工具、观察优先的空间教学体验 |

三个教学模型为本站程序化几何：矩形 / 长方体、L 形支架、盲孔圆柱舱体。NASA 参考只帮助学生建立语境。没有从 Sketchfab、Kenney 或 Poly Haven 下载本项目未用到的素材。

## 离线及可用性

应用代码、字体（界面为系统字体，3D 标注为本地 IBM Plex Mono）、GLB 与 Draco 解码器全部本地提供。正常课堂操作不请求第三方域名；原始来源链接由用户主动打开。首次依赖安装需要包仓库网络；运行后无需 NASA/CDN 在线。此处“离线”指第三方网站不可用时仍可用，本项目没有安装 PWA 或缓存本地主站。
