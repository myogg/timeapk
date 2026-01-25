import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceImage = join(__dirname, 'public', 'app-icon-source.png');

// Android 图标尺寸
const androidSizes = [
  { size: 36, density: 'ldpi' },
  { size: 48, density: 'mdpi' },
  { size: 72, density: 'hdpi' },
  { size: 96, density: 'xhdpi' },
  { size: 144, density: 'xxhdpi' },
  { size: 192, density: 'xxxhdpi' },
];

async function generateAndroidIcons() {
  console.log('开始生成 Android 图标...\n');

  const androidResPath = join(__dirname, 'cordova', 'platforms', 'android', 'app', 'src', 'main', 'res');

  if (!fs.existsSync(androidResPath)) {
    console.log('Android 资源目录不存在，跳过 Android 图标生成');
    return;
  }

  for (const { size, density } of androidSizes) {
    console.log(`生成 ${density} (${size}x${size}) 图标...`);

    const buffer = await sharp(sourceImage)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toBuffer();

    const mipmapDir = join(androidResPath, `mipmap-${density}`);
    if (fs.existsSync(mipmapDir)) {
      const outputPath = join(mipmapDir, 'ic_launcher.png');
      await fs.promises.writeFile(outputPath, buffer);
      console.log(`  ✓ 已生成: ${outputPath.replace(__dirname + '\\', '')}`);
    }
  }

  console.log('\n✅ Android 图标生成完成！');
}

generateAndroidIcons().catch(console.error);
