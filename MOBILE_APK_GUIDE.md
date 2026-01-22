# 手机端APK构建指南

## 方案一：使用在线构建服务（推荐）

### 1. GitHub Actions 自动构建

**步骤1：创建GitHub账户**
- 在手机浏览器访问 [github.com](https://github.com)
- 注册免费账户

**步骤2：创建新仓库**
- 点击"+" → "New repository"
- 仓库名称：workrecord-app
- 选择"Public"（公开）
- 点击"Create repository"

**步骤3：上传代码文件**
- 在仓库页面点击"Add file" → "Upload files"
- 依次上传以下文件：
  - package.json
  - index.html
  - config.xml
  - build-apk-simple.js
  - 以及src文件夹中的所有文件

**步骤4：创建GitHub Actions工作流**
- 点击"Actions"标签
- 点击"Set up a workflow yourself"
- 删除默认内容，粘贴以下代码：

```yaml
name: Build APK

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build web app
      run: npm run build
      
    - name: Setup Cordova
      run: |
        npm install -g cordova
        cordova create cordova com.nocode.workrecord "智能工作记录系统"
        
    - name: Copy files to Cordova
      run: |
        rm -rf cordova/www/*
        cp -r dist/* cordova/www/
        cp config.xml cordova/
        
    - name: Add Android platform
      working-directory: ./cordova
      run: cordova platform add android
      
    - name: Build APK
      working-directory: ./cordova
      run: cordova build android --release
      
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-release-unsigned.apk
        path: cordova/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

- 点击"Start commit" → "Commit new file"

**步骤5：触发构建**
- 回到仓库主页
- 点击"Code" → 上传更多文件（如果需要）
- 构建会自动开始

**步骤6：下载APK**
- 点击"Actions"标签
- 点击最新的构建记录
- 在"Artifacts"部分下载APK文件

### 2. 使用在线Cordova构建服务

**选项A：Monaca.io**
1. 访问 [monaca.io](https://monaca.io)
2. 注册免费账户
3. 创建新项目 → "Import from GitHub"
4. 连接您的GitHub仓库
5. 点击"Build" → "Build for Android"
6. 下载生成的APK

**选项B：Ionic Appflow**
1. 访问 [ionic.io](https://ionic.io)
2. 注册账户（有免费计划）
3. 创建新项目
4. 连接GitHub仓库
5. 设置自动构建
6. 下载APK文件

## 方案二：使用手机APP构建

### 1. 使用AIDE (Android IDE)

**安装步骤：**
1. 在Google Play商店搜索"AIDE"
2. 下载并安装"AIDE-IDE"
3. 打开应用，选择"Create New Project"
4. 选择"PhoneGap/Cordova App"

**配置项目：**
1. 将您的代码文件复制到AIDE项目中
2. 修改config.xml文件
3. 点击"Build" → "Build Release APK"
4. 等待构建完成

### 2. 使用DroidEdit + Termux

**安装应用：**
1. Google Play商店下载"DroidEdit"（代码编辑器）
2. 下载"Termux"（终端模拟器）

**操作步骤：**
1. 在DroidEdit中创建项目文件夹
2. 上传您的代码文件
3. 打开Termux，输入以下命令：

```bash
# 安装必要工具
pkg install nodejs git

# 安装Cordova
npm install -g cordova

# 创建Cordova项目
cordova create workrecord com.nocode.workrecord "智能工作记录系统"
cd workrecord

# 复制您的代码到项目中
# 这里需要手动复制文件

# 添加Android平台
cordova platform add android

# 构建APK
cordova build android --release
```

## 方案三：使用云端开发环境

### 1. Gitpod.io
1. 访问 [gitpod.io](https://gitpod.io)
2. 使用GitHub账户登录
3. 导入您的仓库
4. 在终端中运行构建命令

### 2. CodeSandbox.io
1. 访问 [codesandbox.io](https://codesandbox.io)
2. 创建新项目
3. 上传您的代码
4. 使用内置终端构建

## 推荐方案

**对于手机用户，我强烈推荐方案一的GitHub Actions方法：**

✅ **优点：**
- 完全免费
- 无需安装额外应用
- 自动化构建过程
- 支持持续集成

❌ **缺点：**
- 需要学习基本的GitHub操作
- 首次设置需要一些时间

## 注意事项

1. **文件大小限制：**
   - GitHub免费账户有存储限制
   - 建议只上传必要的文件

2. **构建时间：**
   - 首次构建可能需要10-15分钟
   - 后续构建会更快

3. **APK签名：**
   - 生成的APK是未签名的
   - 可以在手机上直接安装测试
   - 发布到应用商店需要签名

## 获取帮助

如果您在操作过程中遇到问题：

1. **GitHub相关：**
   - 访问 [GitHub帮助文档](https://docs.github.com)
   - 使用中文搜索具体问题

2. **构建问题：**
   - 查看Actions构建日志
   - 检查错误信息

3. **技术支援：**
   - 在GitHub仓库中创建"Issue"
   - 描述您遇到的问题

## 总结

虽然手机操作有一定限制，但通过GitHub Actions等在线服务，您完全可以实现APK的自动构建。这种方法不仅免费，而且相对简单，适合没有电脑的用户使用。

**最简单的步骤总结：**
1. 注册GitHub账户
2. 创建仓库并上传代码
3. 设置GitHub Actions
4. 等待自动构建
5. 下载APK文件

祝您构建成功！
