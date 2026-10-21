import type { Lesson, Step } from '../types';

const s=(title:string,command:string,explanation:string,actions:string[],result:string,mistake:string,hint:string,stage:number,optional=false):Step=>({title,command,explanation,actions,result,mistake,hint,stage,optional});

export const lesson1:Lesson={
  id:'lesson-1',
  title:'First Steps in Fusion',
  subtitle:'From 2D Sketch to 3D Space Habitat',
  duration:'基础建模 · 60–90 min',
  available:true,
  challenge:{
    title:'Make It Yours',
    subtitle:'为你的第一个太空舱，做一个有理由的改变。',
    description:'选一个小改动，在真实 Fusion 中完成。没有唯一答案，但要能解释它解决了什么问题。',
    ideas:['调整 Diameter 与 Length，改变舱体比例。','在轴线平面画圆，用 Extrude Cut 在侧壁开一个观察孔（选修，不含玻璃）。','选择不影响壁厚的边缘，尝试小半径 Fillet。','修改入口尺寸，检查入口板与侧壁仍相连。'],
    review:'改了什么？为什么改？是否留下足够材料？截图或现场展示你的 Fusion 模型。',
    checklist:['我完成了至少一个自主改动','我能解释改动的用途或取舍','我检查了壁厚、材料连接和开口','我保存了 Fusion 文件，并准备展示设计'],
    completionTitle:'First habitat, completed.',
    completionMessage:'从二维轮廓到三维空间，你已经迈出了第一步。'
  },
  missions:[

      {
      id:'welcome',
      label:'INTRODUCTION',
      title:'Welcome to CAD',
      subtitle:'一次拉伸，让想法拥有体积。',
      duration:'10 MIN',
      model:'intro',
      intro:'CAD = Computer-Aided Design。用尺寸和几何关系描述一个可修改、可制造的设计。先试着把平面矩形变成立体，再在自己的 Fusion 中操作。',
      parameters:[{key:'length',name:'Length',min:40,max:120,value:80},{key:'width',name:'Width',min:30,max:80,value:50},{key:'height',name:'Height',min:5,max:60,value:20}],
      steps:[

        s(
          '认识设计工具',
          'CAD / Fusion / Blender',
          'Fusion 擅长以尺寸、约束和特征历史驱动的工程设计；Blender 擅长网格造型、动画和视觉表现。两者有交集，应按任务选工具。',
            ['打开 Fusion，进入 Design 工作区 → Solid。','找到顶部 Toolbar、左侧 Browser、右上角 ViewCube 和底部 Timeline。','Structure 用 Fusion 表达舱段尺寸、接口位置和结构关系。'],
          '你知道在哪里找命令、物体和建模历史。',
          '不要把网页的鼠标操作直接当作 Fusion 的默认设置。',
          '本页：左键 Orbit，右键 Pan，滚轮 Zoom。Fusion 的导航手势会随 Preferences 的导航预设改变。',
          0
        ),

        s(
          '先画轮廓',
          'Sketch',
          'Sketch 是平面上的二维几何；闭合轮廓可以用于生成实体。此处青色区域是 Sketch，箭头标出法向拉伸方向。',
            ['观察模型下方的 XY Sketch 平面。','拖动 Length 和 Width，观察矩形边界变化。','思考：矩形现在有体积吗？'],
          '只有二维矩形，没有厚度和体积。',
          '线段看着连在一起，不一定真的闭合。',
          'Fusion 中闭合区域通常会显示轮廓填充。',
          1
        ),

        s(
          '从二维到三维',
          'Extrude',
          'Extrude 沿方向为闭合轮廓添加深度。拖动 Height 改变拉伸距离，观察真实几何变化。',
            ['先进入本步骤，观察矩形沿箭头变成立体。','拖动 Height，比较 10 mm 与 40 mm。','参数化设计：保留尺寸和特征，修改输入时模型跟着更新。'],
          '一个具有长度、宽度、高度的实体。',
          'Extrude 不只是把草图线条变粗；需要选中轮廓区域。',
          '后续 Mission 会在 Fusion 中复现这个过程。',
          2
        )
      ],
      quiz:{
        question:'Extrude 对闭合 Sketch 做了什么？',
        options:['沿方向生成有深度的几何体','把模型旋转 90°','仅改变显示颜色'],
        answer:0,
        explanation:'Extrude 根据平面轮廓和距离生成几何；Operation 还决定 New Body、Join 或 Cut。'
      }
    },

      {
      id:'object',
      label:'MISSION 01',
      title:'Your First 3D Object',
      subtitle:'一个矩形，三个尺寸，第一件工程零件。',
      duration:'15 MIN',
      model:'block',
      intro:'在 Fusion 中制作 80 × 50 × 20 mm 的长方体。网页用 Z 作为高度方向，XY 作为水平草图平面。步骤选择只控制预览，勾选表示你已经在 Fusion 中完成。',
      parameters:[{key:'length',name:'Length',min:40,max:120,value:80},{key:'width',name:'Width',min:30,max:80,value:50},{key:'height',name:'Height',min:5,max:60,value:20}],
      steps:[

        s(
          '创建草图',
          'Create Sketch',
          '先选择工作平面，再画形状。',
            ['File → New Design，新建设计。','Document Settings → Units，确认单位为 mm。','在 Solid 工具栏点击 Create Sketch。'],
          '进入选择平面的状态。',
          '不要先选中一个无关的实体面。',
          '如果界面找不到命令，按 S 搜索英文命令。',
          0
        ),

        s(
          '选择水平平面',
          'XY Plane',
          '平面决定草图朝向。这里用 XY，Z 是拉伸高度。',
            ['在 Origin 下显示原点平面。','选择 XY 平面；ViewCube 应切到 Top。'],
          '网格与青色 XY 平面对齐。',
          '选成 XZ 或 YZ 会让模型朝向不同。',
          '看坐标轴名称，不要只凭屏幕上的朝向猜。',
          0
        ),

        s(
          '绘制闭合矩形',
          '2-Point Rectangle',
          '用一个角在原点的矩形建立轮廓。',
            ['Sketch → Create → Rectangle → 2-Point Rectangle。','第一点点击原点，第二点点击右上方。'],
          '闭合矩形出现轮廓填充。',
          '用四条独立直线绘制时容易留下缝隙。',
          '初次操作用 Rectangle，比四条 Line 更稳妥。',
          1
        ),

        s(
          '定义准确尺寸',
          'Sketch Dimension · D',
          '尺寸是设计输入，不要靠拖拽估计大小。',
            ['按 D，选择水平边，输入 80 mm。','选择竖直边，输入 50 mm。','确认矩形有一角与原点重合。'],
          '矩形为 80 × 50 mm，定位和尺寸明确。',
          '重复添加已有尺寸可能过度约束。',
          '双击已有尺寸修改，别在同一条边上反复加尺寸。',
          2
        ),

        s(
          '退出草图',
          'Finish Sketch',
          '草图准备好了，回到 Solid 工作区。',
            ['点击右上角 Finish Sketch。','在 Browser 中找到刚创建的 Sketch。'],
          '退出 Sketch 编辑，轮廓仍位于 XY 平面。',
          '按 Esc 只是退出当前命令，不等于 Finish Sketch。',
          '若草图不可见，打开 Sketch 旁边的可见性图标。',
          2
        ),

        s(
          '生成实体',
          'Extrude · E',
          '沿 +Z 拉伸 20 mm，第一次操作选 New Body。',
            ['按 E，点击矩形内部的轮廓区域。','Distance = 20 mm，Direction = One Side。','Operation = New Body，点击 OK。'],
          '80 × 50 × 20 mm 的长方体，Browser 出现 Body。',
          'Distance 为负会朝反方向；选到边线时无法生成所需实体。',
          '选择填充区域，并观察箭头方向。',
          3
        ),

        s(
          '观察并检查',
          'Orbit / Pan / Zoom',
          '绕着模型检查底面、顶面和侧面。',
            ['用 Fusion 导航栏的 Orbit、Pan、Zoom 按钮。','点击 ViewCube 的 Top / Front / Right。','双击 Timeline 的 Extrude，把高度改为 30，再改回 20。'],
          '你能检查模型，也能修改历史特征。',
          '网页与 Fusion 的鼠标快捷手势可能不同。',
          '优先用 Fusion 导航栏，熟悉后再在 Preferences 选择导航预设。',
          3
        )
      ],
      quiz:{question:'要把高度从 20 改成 30 mm，最合理的是？',options:['重新画一个模型','编辑 Timeline 中的 Extrude 距离','只把视图放大'],answer:1,explanation:'修改原有 Extrude 特征保留了建模意图；缩放视图不改变零件尺寸。'}
    },

      {
      id:'bracket',
      label:'MISSION 02',
      title:'Modify Your Design',
      subtitle:'从一个实体，到一件有用途的支架。',
      duration:'20 MIN',
      model:'bracket',
      intro:'构建一体式 L 形支架：底板 80 × 50 mm；厚度 8 mm；立板从底板顶面向上 50 mm。通孔和顶角圆角为选修，模型始终是一件连续零件。',
      parameters:[
          {key:'length',name:'Base length',min:60,max:120,value:80},
          {key:'thickness',name:'Thickness',min:4,max:12,value:8},
          {key:'height',name:'Support height',min:35,max:75,value:50}
      ],
      steps:[

        s(
          '画底板轮廓',
          'Create Sketch → Rectangle',
          '在 XY 平面定义 80 × 50 mm 底板。',
            ['新建设计，确认 mm。','Create Sketch → XY；原点为一个角，画 80 × 50 mm 矩形。','Finish Sketch。'],
          '底板的二维闭合轮廓。',
          '原点位置不同不会改变尺寸，但会影响后续定位。',
          '沿用 Mission 01 的矩形和 Dimension 操作。',
          0
        ),

        s(
          '生成底板',
          'Extrude · New Body',
          '底板厚度默认 8 mm。',
            ['选矩形轮廓，按 E。','Distance = 8 mm；Operation = New Body。'],
          '一块连续的底板实体。',
          '不要将底板厚度误设成支架总高度。',
          '网页 Thickness 同时驱动底板和立板厚度。',
          1
        ),

        s(
          '在顶面画立板',
          'Create Sketch on Face',
          '在底板顶面画靠左短边的窄矩形，宽度贯穿底板。',
            ['选底板顶面 → Create Sketch。','用 Project（P）投影左侧短边和相邻边作定位。','画 8 × 50 mm 矩形，与左边及两侧边重合；Finish Sketch。'],
          '高亮底板顶面上的立板轮廓。',
          '选错面会使立板朝错误的方向长出。',
          '选不准时先 Top，放大；必要时长按左键使用 Select Other。',
          2
        ),

        s(
          '连接立板',
          'Extrude · Join',
          '立板与底板接触，Join 把新体积并入原实体。',
            ['选窄矩形轮廓，E → Distance = 50 mm。','Operation 选 Join，OK。','查看 Browser → Bodies，应只有 1 个 Body。'],
          '一个 L 形实体；总高 = 厚度 + 立板高度。',
          'New Body 会留下两个独立实体；本练习应为 Join。',
          '若 Join 失败，检查窄矩形是否真的贴在底板顶面。',
          3
        ),

        s(
          '切一个真实通孔',
          'Extrude · Cut',
          '选修：在立板外侧面切直径 14 mm 的孔。',
            ['选立板外侧大面 → Create Sketch。','Center Diameter Circle：圆心在面宽中线、立板高度一半，直径 14 mm。','Finish Sketch → E，选圆，Operation = Cut，Extent = All，箭头指向零件。'],
          '贯穿立板厚度的孔，可从背面看到。',
          'New Body 生成的是凸起圆柱，Cut 才移除材料。',
          '孔边距在参数范围内始终大于零。',
          4,
          true
        ),

        s(
          '软化顶部两角',
          'Fillet',
          '选修：仅圆滑立板顶部两条沿厚度方向的短边，半径 4 mm。',
            ['Solid → Modify → Fillet。','选择立板顶部左、右两角沿厚度方向的两条边。','Radius = 4 mm，观察预览，OK。'],
          '顶端左右两个真实圆角，通孔保持不变。',
          '选成长边会得到另一种圆角。',
          '这里展示的是两角圆角，不是所有边统一变圆。',
          5,
          true
        )
      ],
      quiz:{question:'立板应该成为同一个零件，应选择？',options:['New Body','Join','Cut'],answer:1,explanation:'Join 把接触的新体积并入已有实体；完成后检查 Bodies 数量。'}
    },

      {
      id:'habitat',
      label:'MISSION 03',
      title:'Your First Space Habitat',
      subtitle:'为太空生活，设计第一个空间。',
      duration:'25 MIN',
      model:'habitat',
      intro:'这是教学用小比例舱段模型，单位 mm，并非载人压力容器设计。主舱直径 80、长 120；壁厚与后端厚度 4。通过盲孔和环形入口板形成合理空间，不使用 Shell。',
      parameters:[{key:'diameter',name:'Diameter',min:60,max:110,value:80},{key:'length',name:'Length',min:80,max:180,value:120}],
      steps:[

        s(
          '画主舱圆形',
          'Center Diameter Circle',
          '在 YZ 平面画圆，使舱段沿 X 方向延伸。',
            ['新建设计 → mm。','Create Sketch → YZ。','Circle → Center Diameter Circle，以原点为圆心，直径 80 mm；Finish Sketch。'],
          '只有一个圆形草图，没有内部空间。',
          'Radius 是半径，Diameter 是直径，别弄混。',
          'Fusion 使用 Center Diameter Circle 时输入的是直径。',
          0
        ),

        s(
          '拉伸主舱实体',
          'Extrude · New Body',
          '先生成实心圆柱，暂时没有舱内空间。',
            ['E → 圆形轮廓 → Distance = 120 mm。','Operation = New Body。'],
          '实心圆柱；此时打开剖视图也应是实心。',
          '不要把表面的圆线当作已经切开的舱口。',
          '可在 Fusion 中 Inspect → Section Analysis 查看实体。',
          1
        ),

        s(
          '切出舱内空间',
          'Extrude · Cut',
          '从前端切直径 72 mm、深 116 mm 的盲孔，留下 4 mm 侧壁与后端。',
            ['选圆柱前端面 → Create Sketch。','以圆心画直径 72 mm 的同心圆；Finish Sketch。','E → 选圆内区域 → Cut，朝内部，Distance = 116 mm。'],
          '前端敞开，侧壁 4 mm、后端 4 mm 的杯状舱体。',
          '不要用 Through All：它会把后端也切穿。',
          '修改网页尺寸时，内径 = D − 8；盲孔深度 = L − 4。',
          2
        ),

        s(
          '增加环形舱口板',
          'Extrude · Join',
          '在敞口端添加入口板，中心保留较小开口。板厚 4 mm，向舱外延伸。',
            ['选前端的环形端面 → Create Sketch。','画同心外圆 Ø80 mm 和内圆 Ø28 mm；Finish Sketch。','选两圆之间的环形轮廓 → E → 向外 4 mm → Join。'],
          '环形端板连接侧壁，中央真实开口可通向内部；总长 124 mm。',
          '选整个圆会封死入口；要选两圆之间的环。',
          '网页入口直径 = 主舱直径 × 0.35。黄色剖面仅用于观察，不代表切掉的设计。',
          3
        ),

        s(
          '检查空间与壁厚',
          'Inspect · Section Analysis',
          '绕到舱口或打开网页剖视图，检查开口和内壁连通。',
            ['Fusion → Inspect → Section Analysis。','选择穿过舱段轴线的平面。','检查 4 mm 侧壁、4 mm 后端、4 mm 入口板，保存文件。'],
          '你能区分实心、盲孔舱体和带入口板的最终模型。',
          '剖视是查看方式，不会真的改变零件。',
          '网页 Top = +Z，Front = −Y，Right = +X；Right 正对舱口。',
          3
        )
      ],
      quiz:{question:'为什么盲孔深度设为 L − 4，而不是 Through All？',options:['让模型转得更快','保留 4 mm 的后端材料','让外径变小'],answer:1,explanation:'盲孔保留后端材料；Through All 会形成两端都敞开的管子。'}
    }

  ]
};

