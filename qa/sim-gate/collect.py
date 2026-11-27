#!/usr/bin/env python3
"""Copy numbered Maestro screenshots into women/<device>/ and build a contact sheet."""

import argparse
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def numbered_pngs(root: Path) -> list[Path]:
    if not root.exists():
        return []
    found = [
        path
        for path in root.rglob("*.png")
        if path.name[:1].isdigit() and "debug" not in path.parts
    ]
    found.sort(key=lambda path: (path.name, len(path.parts)))
    unique: dict[str, Path] = {}
    for path in found:
        unique.setdefault(path.name, path)
    return [unique[name] for name in sorted(unique)]


def contact_sheet(images: list[tuple[str, Path]], dest: Path) -> None:
    if not images:
        return
    columns = 4
    thumb_w = 220
    label_h = 36
    padding = 12
    thumbs: list[tuple[str, Image.Image]] = []
    for name, path in images:
        with Image.open(path) as image:
            image = image.convert("RGB")
            height = max(1, int(thumb_w * image.height / image.width))
            thumbs.append((name, image.resize((thumb_w, height), Image.Resampling.LANCZOS)))
    thumb_h = max(image.height for _, image in thumbs)
    rows = (len(thumbs) + columns - 1) // columns
    sheet_w = columns * thumb_w + (columns + 1) * padding
    sheet_h = rows * (thumb_h + label_h) + (rows + 1) * padding
    sheet = Image.new("RGB", (sheet_w, sheet_h), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for index, (name, image) in enumerate(thumbs):
        col = index % columns
        row = index // columns
        x = padding + col * (thumb_w + padding)
        y = padding + row * (thumb_h + label_h + padding)
        sheet.paste(image, (x, y))
        draw.text((x, y + thumb_h + 4), name[:32], fill="black", font=font)
    sheet.save(dest)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--maestro-dir", required=True)
    parser.add_argument("--debug-dir", required=True)
    parser.add_argument("--dest", required=True)
    parser.add_argument("--device-name", required=True)
    args = parser.parse_args()

    dest = Path(args.dest)
    dest.mkdir(parents=True, exist_ok=True)
    shots = numbered_pngs(Path(args.maestro_dir))
    if not shots:
        shots = numbered_pngs(Path(args.debug_dir))
    copied: list[tuple[str, Path]] = []
    for path in shots:
        target = dest / path.name
        shutil.copy2(path, target)
        copied.append((path.stem, target))

    debug_dest = dest / "debug"
    debug_root = Path(args.debug_dir)
    if debug_root.exists():
        debug_dest.mkdir(parents=True, exist_ok=True)
        for path in debug_root.rglob("*.png"):
            shutil.copy2(path, debug_dest / path.name)

    contact = dest / "contact-sheet.png"
    contact_sheet(copied, contact)
    manifest = dest / "manifest.txt"
    lines = [f"device: {args.device_name}", f"shots: {len(copied)}"]
    lines.extend(path.name for _, path in copied)
    if not copied:
        lines.append("NO NUMBERED SCREENSHOTS")
    manifest.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
