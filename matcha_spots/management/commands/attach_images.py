import os
from pathlib import Path
import difflib
from django.core.management.base import BaseCommand
from django.core.files import File
from django.utils.text import slugify

from matcha_spots.models import MatchaSpot


APP_DIR = Path(__file__).resolve().parents[2]  # matcha_spots app dir
# Support both possible locations for pics: management/pics and management/commands/pics
PICS_DIR_CANDIDATES = [
    APP_DIR / 'management' / 'pics',
    APP_DIR / 'management' / 'commands' / 'pics',
]

def get_pics_dir():
    for p in PICS_DIR_CANDIDATES:
        if p.exists():
            return p
    # fallback to first candidate (non-existing) so earlier error handling still triggers
    return PICS_DIR_CANDIDATES[0]

PICS_DIR = get_pics_dir()
IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp']


def find_candidate_file(spot_name):
    base_slug = slugify(spot_name)
    candidates = [f"{base_slug}{ext}" for ext in IMAGE_EXTS]

    # also try simple underscored name
    simple = spot_name.lower().replace(' ', '_')
    candidates += [f"{simple}{ext}" for ext in IMAGE_EXTS]

    # compact (alphanumeric only)
    compact = ''.join(ch for ch in spot_name.lower() if ch.isalnum())
    candidates += [f"{compact}{ext}" for ext in IMAGE_EXTS]

    # try each candidate
    for c in candidates:
        p = PICS_DIR / c
        if p.exists():
            return p
    # If exact candidates not found, attempt fuzzy matching against available files
    files = [p for p in PICS_DIR.iterdir() if p.suffix.lower() in IMAGE_EXTS]
    if not files:
        return None

    best = None
    best_ratio = 0.0
    for p in files:
        name_slug = slugify(p.stem)
        ratio = difflib.SequenceMatcher(None, base_slug, name_slug).ratio()
        if ratio > best_ratio:
            best_ratio = ratio
            best = p

    # Accept only reasonably close matches (threshold adjustable)
    if best and best_ratio >= 0.5:
        return best

    return None


class Command(BaseCommand):
    help = 'Attach images from matcha_spots/management/pics to MatchaSpot.image when names match'

    def add_arguments(self, parser):
        parser.add_argument('--overwrite', action='store_true', help='Overwrite existing images')

    def handle(self, *args, **options):
        overwrite = options.get('overwrite', False)

        if not PICS_DIR.exists():
            self.stdout.write(self.style.ERROR(f'Pics directory not found: {PICS_DIR}'))
            return

        attached = 0
        skipped = 0
        not_found = 0

        for spot in MatchaSpot.objects.all():
            if spot.image and not overwrite:
                skipped += 1
                self.stdout.write(self.style.WARNING(f'Skipping (has image): {spot.name}'))
                continue

            pic_path = find_candidate_file(spot.name)
            if pic_path:
                with open(pic_path, 'rb') as f:
                    django_file = File(f)
                    filename = pic_path.name
                    # Optionally prefix with id to avoid collisions
                    save_name = f"{spot.id}_{filename}"
                    spot.image.save(save_name, django_file, save=True)
                    attached += 1
                    self.stdout.write(self.style.SUCCESS(f'Attached {filename} -> {spot.name}'))
            else:
                not_found += 1
                self.stdout.write(self.style.NOTICE(f'No image found for: {spot.name}'))

        self.stdout.write(self.style.SUCCESS(f'Done. attached={attached} skipped={skipped} not_found={not_found}'))
