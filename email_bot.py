#!/usr/bin/env python3
"""
שופיפס - בוט שיווק במייל יומי
Shopips Daily Email Marketing Bot

מייצר קמפיינים יומיים עם מוצר מעניין מהאתר,
עיצוב HTML מרהיב ותוכן שיווקי מותאם לפלאשי (Flashy).

שימוש:
    python email_bot.py                  # מייצר את הקמפיין של היום
    python email_bot.py --day 5          # מייצר קמפיין ליום ספציפי (1-30)
    python email_bot.py --all            # מייצר את כל 30 הקמפיינים
    python email_bot.py --preview 3      # מציג תצוגה מקדימה של קמפיין 3
"""

import json
import os
import sys
import argparse
from datetime import datetime, timedelta
from pathlib import Path

# ============================================================
# CONFIGURATION
# ============================================================

SCRIPT_DIR = Path(__file__).parent
PRODUCTS_DB = SCRIPT_DIR / "products_database.json"
TEMPLATE_FILE = SCRIPT_DIR / "email_template.html"
OUTPUT_DIR = SCRIPT_DIR / "generated_campaigns"
LOG_FILE = SCRIPT_DIR / "campaign_log.md"

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def load_products():
    """Load products database."""
    with open(PRODUCTS_DB, "r", encoding="utf-8") as f:
        return json.load(f)


def load_template():
    """Load HTML email template."""
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
        return f.read()


def get_product_for_day(products, day_number):
    """Get a product for a specific day (cycles through products)."""
    product_list = products["products"]
    index = (day_number - 1) % len(product_list)
    return product_list[index]


def generate_feature_tags(highlight_str):
    """Generate HTML feature tag badges from highlight string."""
    features = [f.strip() for f in highlight_str.split("|")]
    tags_html = ""
    colors = ["#667eea", "#764ba2", "#FF6B6B", "#FF8E53", "#FEC163"]
    for i, feature in enumerate(features):
        color = colors[i % len(colors)]
        tags_html += (
            f'<span style="display: inline-block; background: {color}; '
            f'color: #ffffff; font-size: 12px; font-weight: 600; '
            f'padding: 6px 14px; border-radius: 20px; margin: 3px 3px;">'
            f'{feature}</span>\n'
        )
    return tags_html


def generate_subject_lines(product):
    """Generate subject line and preview text for a product."""
    subjects = [
        f"{product['emoji']} {product['name']} - מבצע מיוחד רק היום!",
        f"🔥 מבצע בלעדי! {product['name']} במחיר מיוחד",
        f"{product['emoji']} הזדמנות אחרונה! {product['name']}",
        f"⭐ המוצר של היום: {product['name']} - אל תפספסו!",
        f"{product['emoji']} חדש באתר! {product['name']} במבצע",
    ]
    previews = [
        f"{product['marketing_hook']} - רק בשופיפס!",
        f"גלו את {product['name']} במחיר שלא תמצאו בשום מקום אחר",
        f"{product['description'][:80]}...",
    ]
    # Rotate based on product id
    idx = (product["id"] - 1)
    return subjects[idx % len(subjects)], previews[idx % len(previews)]


def generate_campaign_name(product, day_number):
    """Generate internal campaign name."""
    date_str = datetime.now().strftime("%Y-%m-%d")
    return f"Daily_Product_{day_number}_{product['name_en'].replace(' ', '_')}_{date_str}"


def build_email_html(product, template):
    """Build the final HTML email from template and product data."""
    subject, preview = generate_subject_lines(product)
    feature_tags = generate_feature_tags(product["highlight"])
    year = datetime.now().year

    html = template
    replacements = {
        "{{SUBJECT_LINE}}": subject,
        "{{PREVIEW_TEXT}}": preview,
        "{{PRODUCT_NAME}}": product["name"],
        "{{PRODUCT_EMOJI}}": product["emoji"],
        "{{MARKETING_HOOK}}": product["marketing_hook"],
        "{{PRODUCT_DESCRIPTION}}": product["description"],
        "{{PRODUCT_CATEGORY}}": product["category"],
        "{{PRODUCT_URL}}": product["url"],
        "{{FEATURE_TAGS}}": feature_tags,
        "{{YEAR}}": str(year),
    }

    for key, value in replacements.items():
        html = html.replace(key, value)

    return html, subject, preview


def save_campaign(html, product, day_number, subject, preview):
    """Save generated campaign HTML to file."""
    OUTPUT_DIR.mkdir(exist_ok=True)
    filename = f"campaign_day_{day_number:02d}_{product['name_en'].replace(' ', '_')}.html"
    filepath = OUTPUT_DIR / filename
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)
    return filepath


def generate_flashy_config(product, day_number, subject, preview):
    """Generate Flashy-compatible campaign configuration."""
    campaign_name = generate_campaign_name(product, day_number)

    config = {
        "campaign_name": campaign_name,
        "subject_line": subject,
        "preview_text": preview,
        "from_name": "שופיפס-Shopips",
        "from_email": "info@shopips.co.il",
        "reply_to": "info@shopips.co.il",
        "unsubscribe_link": "{{unsubscribe_url}}",
        "product_details": {
            "name": product["name"],
            "name_en": product["name_en"],
            "category": product["category"],
            "url": product["url"],
            "description": product["description"],
        },
        "notes": {
            "he": (
                "1. העתק את קוד ה-HTML מקובץ הקמפיין לעורך של פלאשי\n"
                "2. ודא שקישור ההסרה {{unsubscribe_url}} מוגדר נכון\n"
                "3. בדוק תצוגה מקדימה לפני שליחה\n"
                "4. שלח טסט לעצמך לבדיקה"
            ),
        },
    }

    OUTPUT_DIR.mkdir(exist_ok=True)
    config_file = OUTPUT_DIR / f"flashy_config_day_{day_number:02d}.json"
    with open(config_file, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=2)

    return config, config_file


def update_log(day_number, product, subject, filepath, config_file):
    """Update the campaign log file."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = (
        f"\n### יום {day_number} - {product['name']}\n"
        f"- **תאריך יצירה:** {timestamp}\n"
        f"- **שם המוצר:** {product['name']} ({product['name_en']})\n"
        f"- **קטגוריה:** {product['category']}\n"
        f"- **שורת נושא:** {subject}\n"
        f"- **קישור למוצר:** [{product['name']}]({product['url']})\n"
        f"- **קובץ HTML:** `{filepath.name}`\n"
        f"- **קובץ קונפיגורציה לפלאשי:** `{config_file.name}`\n"
        f"- **סטטוס:** ✅ נוצר בהצלחה\n"
    )

    # Initialize log if it doesn't exist
    if not LOG_FILE.exists():
        header = (
            "# 📧 יומן קמפיינים - שופיפס Shopips\n\n"
            "יומן אוטומטי של כל הקמפיינים שנוצרו על ידי בוט השיווק במייל.\n\n"
            "**שולח:** שופיפס-Shopips <info@shopips.co.il>\n"
            "**אתר:** [www.shopips.co.il](https://www.shopips.co.il)\n\n"
            "---\n\n"
            "## קמפיינים שנוצרו\n"
        )
        with open(LOG_FILE, "w", encoding="utf-8") as f:
            f.write(header)

    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(entry)


def print_campaign_summary(day_number, product, subject, preview, filepath, config_file):
    """Print a summary of the generated campaign."""
    print("\n" + "=" * 60)
    print(f"  {product['emoji']}  קמפיין יום {day_number} נוצר בהצלחה!")
    print("=" * 60)
    print(f"\n  שם המוצר:    {product['name']}")
    print(f"  קטגוריה:     {product['category']}")
    print(f"  שורת נושא:   {subject}")
    print(f"  תיאור קצר:   {preview}")
    print(f"\n  קובץ HTML:     {filepath}")
    print(f"  קונפיג פלאשי:  {config_file}")
    print(f"  קישור למוצר:   {product['url']}")
    print("\n" + "-" * 60)
    print("  📋 הוראות לפלאשי:")
    print("  1. פתח את קובץ ה-HTML שנוצר")
    print("  2. העתק את כל הקוד לעורך של פלאשי")
    print("  3. ודא שקישור ההסרה {{unsubscribe_url}} תקין")
    print("  4. שלח טסט לעצמך לבדיקה")
    print("  5. שלח את הקמפיין!")
    print("=" * 60 + "\n")


# ============================================================
# MAIN
# ============================================================

def generate_campaign(day_number):
    """Generate a single campaign for a given day number."""
    data = load_products()
    template = load_template()
    product = get_product_for_day(data, day_number)

    html, subject, preview = build_email_html(product, template)
    filepath = save_campaign(html, product, day_number, subject, preview)
    config, config_file = generate_flashy_config(product, day_number, subject, preview)
    update_log(day_number, product, subject, filepath, config_file)
    print_campaign_summary(day_number, product, subject, preview, filepath, config_file)

    return filepath, config_file


def main():
    parser = argparse.ArgumentParser(
        description="שופיפס - בוט שיווק במייל יומי | Shopips Daily Email Marketing Bot"
    )
    parser.add_argument(
        "--day", type=int, help="מספר היום (1-30) ליצירת קמפיין ספציפי"
    )
    parser.add_argument(
        "--all", action="store_true", help="צור את כל 30 הקמפיינים"
    )
    parser.add_argument(
        "--preview", type=int, help="הצג תצוגה מקדימה של קמפיין ספציפי"
    )
    args = parser.parse_args()

    print("\n" + "=" * 60)
    print("  🚀  שופיפס - בוט שיווק במייל יומי")
    print("  📧  Shopips Daily Email Marketing Bot")
    print("=" * 60)

    if args.all:
        print("\n  📦 מייצר 30 קמפיינים...\n")
        for day in range(1, 31):
            generate_campaign(day)
        print(f"\n  ✅ כל 30 הקמפיינים נוצרו בהצלחה!")
        print(f"  📁 תיקייה: {OUTPUT_DIR}")
        print(f"  📋 יומן: {LOG_FILE}\n")

    elif args.preview:
        data = load_products()
        product = get_product_for_day(data, args.preview)
        subject, preview = generate_subject_lines(product)
        print(f"\n  📋 תצוגה מקדימה - קמפיין יום {args.preview}:")
        print(f"  {'─' * 50}")
        print(f"  מוצר:       {product['emoji']} {product['name']}")
        print(f"  קטגוריה:    {product['category']}")
        print(f"  שורת נושא:  {subject}")
        print(f"  תיאור קצר:  {preview}")
        print(f"  הוק שיווקי: {product['marketing_hook']}")
        print(f"  פיצ'רים:    {product['highlight']}")
        print(f"  קישור:      {product['url']}")
        print(f"  {'─' * 50}\n")

    elif args.day:
        if args.day < 1 or args.day > 30:
            print("  ❌ מספר היום חייב להיות בין 1 ל-30")
            sys.exit(1)
        generate_campaign(args.day)

    else:
        # Default: generate today's campaign based on day of month
        today = datetime.now().day
        print(f"\n  📅 מייצר את הקמפיין של היום (יום {today})...\n")
        generate_campaign(today)


if __name__ == "__main__":
    main()
