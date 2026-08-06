from __future__ import annotations

import json
import shutil
import sys
import tempfile
from pathlib import Path

import gdown
from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[2]
MANIFEST_PATH = ROOT / "tour360" / "drive-manifest.json"
OUTPUT_DIR = ROOT / "tour360" / "assets" / "panos"
TARGET_SIZE = (8192, 4096)


def download_file(file_id: str, destination: Path) -> None:
    url = f"https://drive.google.com/uc?id={file_id}"
    result = gdown.download(url=url, output=str(destination), quiet=False, fuzzy=True)
    if not result or not destination.exists() or destination.stat().st_size == 0:
        raise RuntimeError(f"Không tải được file Google Drive: {file_id}")


def optimize_panorama(source: Path, destination: Path) -> None:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        width, height = image.size
        if width != height * 2:
            raise ValueError(
                f"Ảnh {source.name} không đúng tỷ lệ equirectangular 2:1: {width}x{height}"
            )
        if image.size != TARGET_SIZE:
            image = image.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
        image.save(
            destination,
            format="JPEG",
            quality=82,
            optimize=True,
            progressive=True,
            subsampling=1,
        )


def main() -> int:
    entries = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    if not entries:
        raise RuntimeError("Manifest không có ảnh nào.")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    expected_names = {f"{entry['scene']}.jpg" for entry in entries}

    for old_file in OUTPUT_DIR.glob("scene-*.jpg"):
        if old_file.name not in expected_names:
            old_file.unlink()

    temp_dir = Path(tempfile.mkdtemp(prefix="tour360-drive-"))
    try:
        for index, entry in enumerate(entries, start=1):
            scene = entry["scene"]
            file_id = entry["file_id"]
            source_name = entry.get("source_name", f"{scene}.jpg")
            raw_path = temp_dir / source_name
            output_path = OUTPUT_DIR / f"{scene}.jpg"

            print(f"[{index}/{len(entries)}] Tải {source_name}")
            download_file(file_id, raw_path)
            print(f"[{index}/{len(entries)}] Tối ưu thành {output_path.name}")
            optimize_panorama(raw_path, output_path)
            raw_path.unlink(missing_ok=True)

        total_bytes = sum(path.stat().st_size for path in OUTPUT_DIR.glob("scene-*.jpg"))
        print(f"Hoàn tất {len(entries)} ảnh, tổng {total_bytes / 1024 / 1024:.2f} MB")
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"LỖI: {exc}", file=sys.stderr)
        raise
