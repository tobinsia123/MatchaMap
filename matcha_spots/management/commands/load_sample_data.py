from django.core.management.base import BaseCommand
from django.core.files import File
from pathlib import Path

from matcha_spots.models import MatchaSpot


class Command(BaseCommand):
    help = 'Loads sample matcha spot data for testing'

    def handle(self, *args, **options):
        sample_spots = [
            {
                'name': 'Omomo Tea Shoppe',
                'address': '14433 Culver Dr',
                'city': 'Irvine',
                'state': 'CA',
                'zip_code': '92604',
                'latitude': 33.70679897904999,
                'longitude': -117.78809046157363,
                'rating': 4.3,
                'review_count': 509,
                'description': 'Popular spot for Instagram-worthy matcha drinks with customizable sweetness levels.',
                'phone': '(949) 418-9470',
                'website': 'https://www.omomoteashoppe.com',
                'hours': 'Mon-Sun: 12PM-9PM',
                'price_range': '$$',
                'is_featured': True,
                'image_filename': 'omomo.jpg',
            },
            {
                'name': 'Cha for Tea - University Center',
                'address': '4187 Campus Dr',
                'city': 'Irvine',
                'state': 'CA',
                'zip_code': '92612',
                'latitude': 33.65228893920847,
                'longitude': -117.83673349739844,
                'rating': 4.3,
                'review_count': 545,
                'description': 'Bubble tea and matcha spot near UCI campus, perfect for students.',
                'phone': '(949) 725-0300',
                'website': 'https://www.chafortea.com',
                'hours': 'Sun-Thu: 11AM-11PM | Fri-Sat: 11AM-12AM',
                'price_range': '$',
                'is_featured': True,
                'image_filename': 'chafortea.jpg',
            },
            {
                'name': 'Sharetea - UCI',
                'address': '4199 Campus Dr suite c',
                'city': 'Irvine',
                'state': 'CA',
                'zip_code': '92612',
                'latitude': 33.6507176348606, 
                'longitude': -117.83765227741452,
                'rating': 4.3,
                'review_count': 217,
                'description': 'International bubble tea chain with quality matcha options.',
                'phone': '(949) 333-2946',
                'website': 'https://www.1992sharetea.com/usa',
                'hours': 'Mon-Sun: 11AM-12AM',
                'price_range': '$',
                'is_featured': True,
                'image_filename': 'sharetea.jpg',
            },
            {
                'name': 'MoonGoat Coffee',
                'address': '5171 California Ave',
                'city': 'Irvine',
                'state': 'CA',
                'zip_code': '92617',
                'latitude': 33.63996,
                'longitude': -117.85429,
                'rating': 4.4,
                'review_count': 119,
                'description': '-',
                'phone': '+(949) 612-2875',
                'website': 'https://www.uci.coffee/',
                'hours': 'Mon-Sun: 6AM-6PM',
                'price_range': '$',
                'is_featured': False,
                'image_filename': 'moongoat.jpg',
            },
            {
                'name': 'Pink Pig',
                'address': '4199 Campus Dr',
                'city': 'Irvine',
                'state': 'CA',
                'zip_code': '92612',
                'latitude': 33.64984034556029,
                'longitude': -117.83887695206724,
                'rating': 3.9,
                'review_count': 57,
                'description': '-',
                'phone': 'n/a',
                'website': 'https://pinkpigirvine.square.site',
                'hours': 'Mon-Fri: 11AM-9:30PM | Sat-Sun: 12AM-9:30PM',
                'price_range': '$',
                'is_featured': False,
                'image_filename': 'pinkpig.jpg',
            },
            {
                'name': 'Cafe Espresso',
                'address': '4199 Campus Dr',
                'city': 'Irvine',
                'state': 'CA',
                'zip_code': '92697',
                'latitude': 33.644047812277904,
                'longitude': -117.84302823130433,
                'rating': 4.1,
                'review_count': 62,
                'description': '-',
                'phone': '(949) 690-3075',
                'website': 'https://cafeespresso.hrpos.heartland.us/menu',
                'hours': 'Mon-Fri: 8AM-4PM | Sat-Sun: Closed',
                'price_range': '$',
                'is_featured': False,
                'image_filename': 'cafeespresso.jpg',
            },
            {
                'name': 'Paris Baguette',
                'address': '4503 Campus Dr',
                'city': 'Irvine',
                'state': 'CA',
                'zip_code': '92612',
                'latitude': 33.649672217098605,
                'longitude': -117.83234719124088,
                'rating': 4.5,
                'review_count': 67,
                'description': '-',
                'phone': '(949) 800-8885',
                'website': 'https://parisbaguette.com/locations/ca/irvine/4503-campus-drive/',
                'hours': 'Mon-Sun: 7AM-9:30PM',
                'price_range': '$$',
                'is_featured': False,
                'image_filename': 'parisbaguette.jpg',
            },
            {
                'name': "MOri's",
                'address': '6280 Scholarship',
                'city': 'Irvine',
                'state': 'CA',
                'zip_code': '92612',
                'latitude': 33.66819541127827,
                'longitude': -117.8466204514838,
                'rating': 4.7,
                'review_count': 112,
                'description': '-',
                'phone': '(949) 400-9314',
                'website': 'n/a',
                'hours': 'Mon-Sun: 9:30AM-7:30PM',
                'price_range': '$$',
                'is_featured': False,
                'image_filename': "mori's.jpg",
            },
            {
                'name': 'Blk Dot Coffee',
                'address': '19510 Jamboree Rd Suite 150',
                'city': 'Irvine',
                'state': 'CA',
                'zip_code': '92612',
                'latitude': 33.66105171787343,
                'longitude': -117.85983833907011,
                'rating': 4.5,
                'review_count': 251,
                'description': '-',
                'phone': '(949) 752-2882',
                'website': 'https://blkdotcoffee.com/',
                'hours': 'Mon-Fri: 7AM-3PM | Sat-Sun: Closed',
                'price_range': '$',
                'is_featured': False,
                'image_filename': 'blkdot.jpg',
            },
            {
                'name': 'Bopomofo Cafe',
                'address': '5365 Alton Pkwy Ste G',
                'city': 'Irvine',
                'state': 'CA',
                'zip_code': '92604',
                'latitude': 33.67588591626918,
                'longitude': -117.77915688133014,
                'rating': 4.5,
                'review_count': 42,
                'description': '-',
                'phone': 'n/a',
                'website': 'http://bopomofocafe.com/',
                'hours': 'Mon-Sun: 11AM-9PM',
                'price_range': '$',
                'is_featured': False,
                'image_filename': 'bopomofo.jpg',
            },
            {
                'name': 'Junbi Matcha & Tea - Irvine',
                'address': '15333 Culver Dr #360',
                'city': 'Irvine',
                'state': 'CA',
                'zip_code': '92604',
                'latitude': 33.70885243526474,
                'longitude': -117.78293442928853,
                'rating': 4.3,
                'review_count': 71,
                'description': '-',
                'phone': '(949) 404-1000',
                'website': 'https://junbishop.com/',
                'hours': 'Mon-Sun: 11AM-9PM',
                'price_range': '$',
                'is_featured': False,
                'image_filename': 'junbi.jpg',
            },
            {
                'name': 'Tea Maru',
                'address': '6785 Quail Hill Pkwy',
                'city': 'Irvine',
                'state': 'CA',
                'zip_code': '92603',
                'latitude': 33.65878147337283,
                'longitude': -117.76440381594688,
                'rating': 3.8,
                'review_count': 110,
                'description': '-',
                'phone': '(949) 783-9808',
                'website': 'http://www.teamaru.us/',
                'hours': 'Mon-Sun: 11:30AM-9:30PM',
                'price_range': '$',
                'is_featured': False,
                'image_filename': 'teamaru.jpg',
            },
            {
                'name': 'The Moon Tea House - Costa Mesa',
                'address': '369 E 17th St Ste 12',
                'city': 'Costa Mesa',
                'state': 'CA',
                'zip_code': '92627',
                'latitude': 33.63470224512969,
                'longitude': -117.9084788036545,
                'rating': 4.7,
                'review_count': 61,
                'description': '-',
                'phone': '(657) 462-5587',
                'website': 'https://tmoon.us/',
                'hours': 'Mon-Sun: 11AM-9PM',
                'price_range': '$',
                'is_featured': False,
                'image_filename': 'themoon.jpg',
            },
        ]

        # First, clear all existing spots
        MatchaSpot.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Cleared existing spots'))

        created_count = 0
        for spot_data in sample_spots:
            # Remove image_filename from the data before creating the spot
            spot_data_copy = spot_data.copy()
            image_filename = spot_data_copy.pop('image_filename', None)
            
            # Create the spot
            spot = MatchaSpot.objects.create(**spot_data_copy)
            created_count += 1
            self.stdout.write(self.style.SUCCESS(f'Created: {spot.name}'))

            # Attach image if provided
            if image_filename:
                app_dir = Path(__file__).resolve().parents[2]
                pics_dir = app_dir / 'management' / 'commands' / 'pics'
                img_path = pics_dir / image_filename

                if img_path.exists():
                    with open(img_path, 'rb') as f:
                        spot.image.save(f"{spot.id}_{image_filename}", File(f), save=True)
                        self.stdout.write(self.style.SUCCESS(f'  Attached image {image_filename}'))
                else:
                    self.stdout.write(self.style.WARNING(f'  Image not found: {img_path}'))

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully loaded {created_count} new matcha spots!'
            )
        )