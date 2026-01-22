# APK 构建说明

## 本地构建

### 前提条件
1. 安装 Node.js (v16 或更高版本)
2. 安装 Cordova CLI: `npm install -g cordova`
3. 安装 Android Studio 和 Android SDK
4. 配置 Android 环境变量

### 构建步骤

1. **安装依赖**
   ```bash
   npm install
   ```

2. **运行构建脚本**
   ```bash
   node build-apk.js
   ```

3. **获取APK文件**
   构建完成后，APK文件位于：
   ```
   cordova/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
   ```

## 在线构建服务

### 使用 GitHub Actions

1. **创建 GitHub 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **创建 GitHub Actions 工作流**
   在 `.github/workflows/build-apk.yml` 创建文件：

   ```yaml
   name: Build APK

   on:
     push:
       branches: [ main ]
     pull_request:
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

### 使用其他在线构建服务

1. **Expo Application Services (EAS)**
   - 支持 React Native 应用
   - 提供云构建服务
   - 需要 Expo 配置

2. **Ionic Appflow**
   - 支持 Cordova 和 Capacitor 应用
   - 提供持续集成和部署
   - 付费服务

3. **Microsoft App Center**
   - 支持多种平台
   - 提供构建、测试和分发
   - 免费和付费计划

## 签名APK

### 生成签名密钥
```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias
```

### 配置签名
在 `cordova/platforms/android/gradle.properties` 添加：
```
storeFile=my-release-key.jks
storePassword=your-store-password
keyAlias=my-alias
keyPassword=your-key-password
```

### 构建签名APK
```bash
cordova build android --release -- --keystore="my-release-key.jks" --storePassword=your-store-password --alias=my-alias --password=your-key-password
```

## 发布到应用商店

### Google Play Store
1. 注册 Google Play 开发者账户 ($25 一次性费用)
2. 准备应用截图和描述
3. 上传签名APK
4. 提交审核

### 华为应用市场
1. 注册华为开发者账户
2. 准备应用材料
3. 上传APK文件
4. 提交审核

## 注意事项

1. **应用权限**: 确保在 `config.xml` 中正确配置应用权限
2. **应用图标**: 准备不同尺寸的图标文件
3. **应用名称**: 确保应用名称符合各应用商店要求
4. **隐私政策**: 准备隐私政策文档
5. **测试**: 在不同设备上测试APK文件

## 常见问题

### 构建失败
- 检查 Node.js 和 Cordova 版本
- 确保 Android SDK 正确安装
- 检查环境变量配置

### APK无法安装
- 确保APK已正确签名
- 检查设备是否允许安装未知来源应用
- 确认APK架构与设备兼容

### 应用崩溃
- 检查设备日志: `adb logcat`
- 确保所有依赖正确打包
- 测试不同Android版本
