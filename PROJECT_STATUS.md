# 项目交接文档 (Project Handover Status)

**最后更新时间**: 2025-12-15  
**当前版本**: v1.0.0 (Feature Complete)

## 1. 项目概览
本项目是一个功能完备的 **MERN Stack (MongoDB, Express, React, Node.js)** 电子商务网站。
它实现了从用户注册、商品浏览、购物车管理、下单支付（模拟）到订单查询、商品评价的全套流程，并包含一个基础的后台管理面板。

## 2. 技术栈详情

### 前端 (Client)
- **框架**: React 18 + Vite
- **UI 库**: Tailwind CSS (Styling), Lucide-react (Icons)
- **路由**: React Router DOM v6
- **状态管理**: React Context API (`AuthContext`, `CartContext`)
- **HTTP 请求**: Axios (封装了拦截器，自动处理 Token)
- **通知**: React Hot Toast
- **错误处理**: 自定义 `ErrorBoundary` 组件

### 后端 (Server)
- **运行时**: Node.js
- **Web 框架**: Express.js
- **数据库**: MongoDB (Mongoose ODM)
- **认证**: JWT (JSON Web Token)
- **加密**: Bcryptjs (密码 Hash)
- **邮件服务**: Nodemailer (用于注册验证码)
- **日志**: 自定义 MongoDB 日志记录 (`Log` Model)

## 3. 已实现功能 (Features)

### 用户模块 (User)
- [x] **注册验证**: 完整的邮箱验证流程（注册 -> 发送 6 位验证码 -> 验证 -> 自动登录）。
- [x] **登录/退出**: JWT 认证，支持 Token 自动过期。
- [x] **个人中心**: 修改昵称、管理多个收货地址（增/删）。
- [x] **全局状态**: 登录状态实时同步，刷新页面不丢失。

### 商品模块 (Product)
- [x] **商品展示**: 首页分页显示，支持图片懒加载/加载失败占位。
- [x] **搜索功能**: 支持按关键词模糊搜索商品。
- [x] **详情页**: 展示商品详细信息、库存状态。
- [x] **评价系统**: 用户购买后可评分（1-5星）并撰写评论，显示平均分。

### 交易模块 (Order & Cart)
- [x] **购物车**: 添加/删除/修改数量，计算总价，本地存储持久化。
- [x] **下单流程**: 选择收货地址（从地址簿选择或新增），模拟支付。
- [x] **订单管理**: 用户可查看历史订单状态（待发货/已送达）。
- [x] **支付模拟**: 下单即视为支付成功 (`isPaid: true`)。

### 管理模块 (Admin)
- [x] **商品管理**: 管理员可添加、编辑、删除商品（基础 CRUD）。
- [x] **权限控制**: 后端路由 `admin` 权限校验。

## 4. 关键配置与环境变量

### 后端 (.env)
必须在 `server` 目录下配置 `.env` 文件：
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/purchasing_web
JWT_SECRET=your_super_secret_key_here
# 邮件服务配置 (QQ邮箱/网易邮箱等 SMTP)
EMAIL_HOST=smtp.qq.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your_email@qq.com
EMAIL_PASS=your_email_auth_code
EMAIL_FROM=your_email@qq.com
```

### 前端 (Axios)
配置文件位于 `client/src/api/axios.js`。
- 默认 Base URL: `http://localhost:5000/api`
- 如果部署到公网或局域网访问，需修改为服务器真实 IP。

## 5. 目录结构说明
参见根目录下的 `directory_tree.txt` 获取完整文件树。
- `client/src/context`: 存放全局状态逻辑 (`AuthContext` 修复了登录 UI 不更新的问题)。
- `client/src/components`: 公共组件 (`Navbar`, `ErrorBoundary`)。
- `server/controllers`: 业务逻辑核心。
- `server/utils/sendEmail.js`: 邮件发送工具函数。

## 6. 已知问题与后续建议 (Next Steps)

1.  **部署 (Deployment)**:
    - 目前运行在本地开发模式 (`npm run dev` / `node index.js`)。
    - 建议使用 PM2 管理后端进程，Nginx 托管前端静态构建 (`npm run build`)。
2.  **安全性**:
    - `JWT_SECRET` 目前在代码中可能有默认回退值，生产环境务必强制使用环境变量。
    - 支付功能目前是模拟的，需对接 Stripe/Alipay 真实网关。
3.  **图片存储**:
    - 目前商品图片使用 URL 字符串。建议集成 AWS S3 或类似对象存储服务来实现图片上传功能。

## 7. 启动指南 (为接手者准备)

**后端:**
```bash
cd server
npm install
# 确保 MongoDB 已启动
node index.js
```

**前端:**
```bash
cd client
npm install
npm run dev
```

---
**交接语**:
项目代码结构清晰，前后端分离，核心电商闭环已打通。最近一次更新修复了注册页白屏 Bug（由于函数丢失）并完善了错误捕捉机制。现在是一个稳定可演示的版本。
