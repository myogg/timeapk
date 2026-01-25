import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceImage = join(__dirname, 'public', 'app-icon-source.png');

// 定义需要生成的图标尺寸和文件名
const iconSizes = [
  { size: 512, names: ['pwa-512x512.png', 'android-chrome-512x512.png'] },
  { size: 192, names: ['pwa-192x192.png', 'android-chrome-192x192.png'] },
  { size: 180, names: ['apple-touch-icon.png'] },
  { size: 32, names: ['favicon-32x32.png'] },
  { size: 16, names: ['favicon-16x16.png'] },
];

async function generateIcons() {
  console.log('开始生成图标...\n');

  // 读取源图片
  const image = sharp(sourceImage);
  const metadata = await image.metadata();
  console.log(`源图片尺寸: ${metadata.width}x${metadata.height}\n`);

  // 生成各种尺寸的图标
  for (const { size, names } of iconSizes) {
    console.log(`生成 ${size}x${size} 尺寸的图标...`);

    const buffer = await sharp(sourceImage)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toBuffer();

    // 保存到 public 目录
    for (const name of names) {
      const outputPath = join(__dirname, 'public', name);
      await fs.promises.writeFile(outputPath, buffer);
      console.log(`  ✓ 已生成: public/${name}`);
    }

    // 同时保存到 build 目录（如果存在）
    const buildDir = join(__dirname, 'build');
    if (fs.existsSync(buildDir)) {
      for (const name of names) {
        const outputPath = join(buildDir, name);
        await fs.promises.writeFile(outputPath, buffer);
        console.log(`  ✓ 已生成: build/${name}`);
      }
    }

    // 保存到 cordova 相关目录
    const cordovaDirs = [
      join(__dirname, 'cordova', 'public'),
      join(__dirname, 'cordova', 'www'),
      join(__dirname, 'cordova', 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www')
    ];

    for (const dir of cordovaDirs) {
      if (fs.existsSync(dir)) {
        for (const name of names) {
          const outputPath = join(dir, name);
          await fs.promises.writeFile(outputPath, buffer);
          console.log(`  ✓ 已生成: ${dir.replace(__dirname + '\\', '')}/${name}`);
        }
      }
    }

    console.log('');
  }

  // 生成 favicon.ico (使用 32x32 的图片)
  console.log('生成 favicon.ico...');
  const faviconBuffer = await sharp(sourceImage)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png()
    .toBuffer();

  const faviconPaths = [
    join(__dirname, 'public', 'favicon.ico'),
    join(__dirname, 'build', 'favicon.ico'),
    join(__dirname, 'cordova', 'public', 'favicon.ico'),
    join(__dirname, 'cordova', 'www', 'favicon.ico'),
  ];

  for (const path of faviconPaths) {
    const dir = dirname(path);
    if (fs.existsSync(dir)) {
      await fs.promises.writeFile(path, faviconBuffer);
      console.log(`  ✓ 已生成: ${path.replace(__dirname + '\\', '')}`);
    }
  }

  console.log('\n✅ 所有图标生成完成！');
}

generateIcons().catch(console.error);
