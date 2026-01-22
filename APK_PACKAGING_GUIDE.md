# APK打包指南

## 前提条件

在开始打包之前，请确保您已安装以下软件：

### 必需软件
- **Node.js** (v16或更高版本)
- **Cordova CLI**: `npm install -g cordova`
- **Android Studio** 和 **Android SDK**
- **Java Development Kit (JDK)**

### 环境变量配置
确保以下环境变量已正确设置：
- `JAVA_HOME`: 指向JDK安装目录
- `ANDROID_HOME`: 指向Android SDK安装目录
- `PATH`: 包含`%JAVA_HOME%\bin`和`%ANDROID_HOME%\platform-tools`

## 快速打包

### 方法一：使用一键打包脚本（推荐）

1. **安装Cordova CLI**
   ```bash
   npm install -g cordova
   ```

2. **运行打包脚本**
   ```bash
   node package-apk.js
   ```

3. **获取APK文件**
   打包完成后，APK文件将生成在：
   ```
   cordova/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
   ```

### 方法二：手动打包步骤

1. **构建React项目**
   ```bash
   npm run build
   ```

2. **初始化Cordova项目**
   ```bash
   cordova create cordova com.nocode.workrecord "智能工作记录系统"
   cd cordova
   cordova platform add android
   ```

3. **复制文件**
   ```bash
   # 清空Cordova www目录
   rm -rf www/*
   
   # 复制构建文件
   cp -r ../dist/* www/
   
   # 复制配置文件
   cp ../config.xml .
   ```

4. **构建APK**
   ```bash
   cordova build android --release
   ```

## 应用签名

要发布到应用商店，您需要对APK进行签名：

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
1. 注册Google Play开发者账户 ($25一次性费用)
2. 准备应用截图和描述
3. 上传签名APK
4. 提交审核

### 华为应用市场
1. 注册华为开发者账户
2. 准备应用材料
3. 上传APK文件
4. 提交审核

## 常见问题

### 构建失败
- 检查Node.js和Cordova版本
- 确保Android SDK正确安装
- 检查环境变量配置

### APK无法安装
- 确保APK已正确签名
- 检查设备是否允许安装未知来源应用
- 确认APK架构与设备兼容

### 应用崩溃
- 检查设备日志: `adb logcat`
- 确保所有依赖正确打包
- 测试不同Android版本

## 在线构建服务

如果您没有Android开发环境，可以使用以下在线服务：

### GitHub Actions (免费)
- 将代码推送到GitHub仓库
- 配置GitHub Actions工作流
- 自动构建并生成APK下载链接

### Expo Application Services (EAS)
- 支持React Native应用
- 提供云构建服务
- 有免费额度

### Ionic Appflow
- 支持Cordova应用
- 提供持续集成和部署
- 付费服务

## 技术支持

如果您在打包过程中遇到问题，请参考：
- [Cordova官方文档](https://cordova.apache.org/docs/)
- [Android开发者文档](https://developer.android.com/studio/build)
- [GitHub Actions文档](https://docs.github.com/en/actions)
