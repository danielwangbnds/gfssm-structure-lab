# GFSSM Structure Lab

面向 GFSSM Structure Department G10 新成员的 Fusion 交互式辅助教材。

## 本地运行

需要 Node.js **22.18 或更高版本**，推荐使用 pnpm 11.25.0（锁文件已提交）。

```bash
cd gfssm-structure-lab
pnpm install --frozen-lockfile
pnpm dev
```

打开显示的本地网址，通常为 `http://127.0.0.1:5173/`。

```bash
pnpm test       # 几何、课程内容及本地素材检查
pnpm build      # 版权声明生成 + TypeScript 类型检查 + Vite 生产构建
pnpm preview    # 在本地预览 dist/，通常为 http://127.0.0.1:4173/
pnpm notices    # 更新第三方软件版权声明
```

也可使用 npm 安装和运行同名脚本；固定复现当前依赖版本时请优先用 pnpm 与 `pnpm-lock.yaml`。pnpm 的构建许可仅开启项目需要的 esbuild。开发和预览服务仅监听本机，不会自动向局域网或公网开放。

## 完整 Lesson 1

- **Introduction / 10 min**：CAD、Fusion 与 Blender、Sketch、Extrude、参数化设计；从二维矩形动态拉伸为实体。
- **Mission 01 / 15 min**：80 × 50 × 20 mm 长方体，7 个操作步骤；独立修改长、宽、高。
- **Mission 02 / 20 min**：L 形支架，顶面草图、Join、真实 Ø14 通孔、顶部两角 R4 圆角；修改底板长度、厚度、立板高度。
- **Mission 03 / 25 min**：圆形草图 → 实心圆柱 → 留有后端的盲孔 → 带真实开口的环形入口板；实时修改直径与主舱长；有准确的剖面和封闭切面。
- **Final Challenge**：自主改动方向、设计检查与自评清单，不自动验证真实 Fusion 文件。
- Lesson 2–5 在导航中显示 Coming Soon。

每步包含中文说明、英文 Fusion 命令、具体操作、预期结果、常见错误与可展开提示。滑块用于探索变体，教程文字使用默认课堂尺寸；点击 RESET 可恢复参考尺寸。

## 查看器与课堂工具

- 复用 Drei / Three.js 的 OrbitControls：左键 Orbit、右键 Pan、滚轮 Zoom；触屏单指旋转，双指缩放 / 平移。
- Isometric / Top / Front / Right 预设视角；手动操作后不再错误地高亮预设视角。
- 网格、坐标轴、尺寸标注开关；重置模型参数与视角。
- 标注使用 Drei Text + ScreenSizer + Billboard 与本地 IBM Plex Mono，保持镜头朝向和字号，避免多根 HTML 渲染的卸载冲突。
- 讲师模式：放大模型、精简文字、左右方向键切步、浏览器全屏。全屏不可用时给出操作提示。
- 完成记录保存在 LocalStorage，可导出 JSON；选修步骤不计入必修进度分母。
- 新手错误图解、小测答题解释、挑战完成反馈。
- 响应式桌面三栏；窄屏课程抽屉和上下阅读布局；对话框有焦点约束、Escape 关闭及背景交互隔离。

网页与 Fusion 的鼠标导航预设不同；教程优先指导使用 Fusion 导航栏与 ViewCube。

## 真实航天器参考与资源复用

侧栏「真实航天器参考」使用 **NASA / Michael D. Carbajal 的 ISS GLB**。原始压缩模型约 466 KiB，随项目本地保存，Draco 解码器也在本地，无需 NASA 或 CDN 在线。

参考模型按需加载，可旋转、缩放、平移、自动环绕和重置。其用途是辨认圆柱舱段、桁架和连接关系。核心教学模型仍为程序化几何，不受下载模型影响。

已核对 Autodesk 的 Extrude 文档、Three.js controls / loader / geometry 工具、Drei 组件文档和 NASA 素材使用指南。完整来源、作者、实际许可证、适配方式和本地路径见 [ASSET_SOURCES.md](ASSET_SOURCES.md)。第三方版权声明在 `public/licenses/`，素材许可在相应 `public/assets/` 目录，都会进入生产构建。

## 文件结构

```text
src/
  App.tsx                     课程工作台、任务与课堂状态
  types.ts                    Lesson / Mission / Step / Parameter 类型
  lessons/
    lesson1.ts                Lesson 1 完整教学数据与挑战
    index.ts                  课程列表及新手错误
  models/
    Block.tsx                 矩形 / 长方体与拉伸动画
    Bracket.tsx               支架、通孔和圆角
    Habitat.tsx               舱体、真实剖视、硬边法线
    geometry.ts               Three.js 几何轮廓
    profiles.ts               独立数值轮廓
    Label.tsx                 原生 3D 工程标注
    shared.tsx                尺寸线和草图平面
    index.tsx                 模型注册表
  components/
    Viewer.tsx                场景、相机、网格和导航控件
    SpaceReference.tsx        按需加载的 NASA ISS 参考
    Quiz.tsx / Mistakes.tsx    小测与错误图解
  hooks/useProgress.ts        本地完成记录
  styles.css                  桌面 / 窄屏 / 投屏布局
public/
  assets/iss-nasa.glb          原始 NASA 下载文件
  assets/draco/               本地解码器与 Apache-2.0 原文
  assets/fonts/               本地 IBM 字体与 OFL 原文
  assets/ISS_CREDITS.txt       模型来源及显示适配说明
  licenses/                   软件版权声明
scripts/generate-notices.mjs   根据依赖生成版权汇总
tests/                        数值轮廓、真实网格、素材测试
dist/                         已构建的静态网站
ASSET_SOURCES.md               素材清单及研究记录
TESTING.md                     已通过和未覆盖的验收范围
```

## 新增课程

1. 在 `src/lessons/` 新建 `Lesson` 数据文件；每个 Mission 配置参数、教程步骤及对应模型 ID。
2. 通过 `stage` 让真实几何对应 Sketch / Solid / Cut 等不同阶段，而非仅切换文字。
3. 添加接收 `ModelProps`（`params`、`stage`、`section`、`dimensions`）的模型组件。
4. 在 `src/models/index.tsx` 注册 ID 与模型组件。
5. 在 `src/lessons/index.ts` 注册课程，设置 `available: true`；导航会自动提供入口。
6. 可选的 `Lesson.challenge` 配置设计方向、自评与完成反馈；未配置时不显示挑战入口。

内容、模型与通用工作台分开。完成记录与参数状态按课程、任务命名。当前完成记录按步骤序号保存；发布后若重排已有步骤，应升级存储版本或迁移旧记录。

## 几何与教学约定

Z 朝上。矩形练习使用 XY，舱体使用 YZ 圆形并沿 X 延伸。网页为观察方便将几何居中；Fusion 教程可用原点作为矩形角点，两者形状和尺寸一致。

舱体默认 D=80、L=120 mm：先生成实心圆柱；切 Ø72、深116 的盲孔，保留4 mm 侧壁和后端；加入厚4 mm、入口 Ø28 的环形板，最终总长124 mm。改变滑块后，内径 = D−8，盲孔深度 = L−4，入口直径 = D×0.35，总长 = L+4。剖视改变观察方式，不改变设计。

支架宽度固定50 mm，立板高度从底板顶面算起；总高 = 厚度 + 立板高度。选修圆角仅作用于顶部两条沿厚度方向的短边，R4 mm。观察窗作为 Fusion 中的开放挑战，不提供网页自动建模。

## 验证与限制

已完成依赖安装、TypeScript 检查、生产构建、6 项自动测试和内置浏览器实际 WebGL 交互验收。测试包含 5,151 组舱体参数体积检查及真实网格射线检测。详细浏览器项目与未覆盖范围见 [TESTING.md](TESTING.md)。

这是一套教学查看器，未实现 CAD 内核、约束求解、装配系统或 Fusion 文件导入导出。剖切和真实开口由参数轮廓生成；支架开孔阶段以接触的底板和立板网格表达外形，不提供可制造拓扑 / STEP 输出。模型是教学比例，不是实际载人压力容器设计。

无账号、数据库或付费 API；记录只在当前浏览器与站点地址下保存，不跨设备同步。不要在私人浏览窗口清理后期待记录仍保留。运行不依赖第三方网站，但需要本地主站正常提供文件；未添加 PWA 安装或离线主站缓存。

生产输出 `dist/` 可放在静态托管服务中；请通过 HTTP(S) 提供，不要直接双击 index.html。发布托管不属于本次本地开发任务。尚未完成独立 Chrome / Edge、Windows 硬件环境矩阵测试，建议首次授课前用教室设备做一次走课。
