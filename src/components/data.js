export const dairy_items = ["Milk", "Low Fat Butter", "CREAM", "Curd", "Greek Yogurt", "Paneer", "Tofu", "Custard Coolem", "Ice Cream Milk", "Ice cube"];
export const poultry_items = ["Eggs", "FISH", "Chicken Breast", "Chicken Keema", "Chicken Wings"];
export const bakery_items = ["Brown Bread Jumbo", "Pizza Base Wheat", "Burger Bun Wheat"];
export const grocery_items = [
    "Museli", "ajinomoto", "dates", "Aata", "Maida", "Bajra Aata", "Besan",
    "Baking Powder", "Brown Rice", "White Rice (Golden Sella Double Chabbi)", "Coffee", "Pineapple Slice Tin",
    "Tomato Puree", "DryYeist", "Quinua/ Foxtail / Kudos", "Couc Cous", "Red Beans", "White Kidney Beans",
    "Kabuli Chana", "Moong Whole (Sprouts)", "Chocolate Syrup", "Kevada Water", "Rose Water",
    "Mix Seeds (Sunflower, Pumpkin, Flex)", "Seasme Seeds", "Chia Seeds", "Hemp Seeds", "Jeerawan Powder",
    "Sugar", "Dhania Whole", "Mustard Seeds", "Peanuts Raw", "King Soya Oil", "Olive Oil", "Mustard Oil",
    "Peanut Butter", "Coco Powder", "Poha", "Oats", "Rolled Oats", "Moosli", "Honey", "Milkmaid",
    "Dark Compound", "Kismish", "Black Raisin", "Kaju", "Magaj", "Almonds", "Wallnuts", "Custard Powder",
    "Nachos", "Beetroot Chips", "Daliya", "HOT GARLIC SAUCE", "Haldiram Salted Peanuts", "Red Chilly Whole",
    "Coconut Milk Powder", "Coconut Powder", "Vanilla Frappe", "Vanilla Essence", "Parley Ji Buiscuit",
    "Black Olives", "Alipino", "Oregano", "Chilly Flakes", "Black Pepper", "Rock Salt", "Salt", "Haldi",
    "Kitchen King", "Degi Mirch", "Rajma Masala", "Jeera", "Maggi Masala", "Ghee", "Badi Elaichi",
    "Elachi Powder", "Staff Rice", "Staff Tea", "Phynile", "Pasta", "Clove", "Tej Patta", "Sooji",
    "Smokey Barbeque Masala", "Chat Masala", "Chicken Tikka Masala (Shan)", "Kebab Masala (Shan)",
    "Kasturi Methi", "Biryani Masala", "Peri Peri Masala", "Italian Mix Seasoning", "Garlic Powder",
    "Thai Curry Masala", "Caramel Syrup", "Cheese Cake Casata Syrup", "Tomato Ketchup", "TObasco", "Vinegar",
    "Soya Sauce", "Teriyaki Sauce", "Thai Sweet Chilly Sauce", "Kasundi Mustard", "English Mustard",
    "Barbeque Sauce", "Thousand Sauce", "Chilly Garlic Sauce", "Chipotle Sauce", "Sweet Onion Sauce",
    "Red Chilly Sauce", "Mayonese", "Strawberry Crush", "Blueberry Crush", "Hazelnut Syrup", "Cajun Powder",
    "Pineapple Juice Tetra", "Mix Berries Frozen", "BlueBerries Frozen", "Strawberry Frozen",
    "Soya Tikka Frozen (Vegley)", "Cheddar Cheese Slice", "Mozerella Cheese", "Cheese Block", "Pancake Mix",
    "Origano Mix Sachet", "Chilly Flakes Sachet", "sabudana", "Bhuna Chana", "Silver Foil", "soya chunks",
    "water"
];
export const fruit_items = [
    "Apple (Imp.)", "Banana", "Pomegranate", "Papaya", "Watermelon", "Dragon Fruit",
    "Kiwi (zespari)", "Grapes", "Red Globe", "Khajur (Kimia)", "Orange/Malta",
    "Sharda", "Guvava", "Pineapple", "Avacado", "Pears Indian"
];
export const vegetable_items = [
    "Aamla", "Curry Patta", "arbi", "Onion", "Tomato", "Potato", "Zuccini", "Brokli",
    "Carrot", "Beans", "Cucumber", "Mushroom", "Capsicum", "Lemon", "Mint", "Red Cabbage",
    "Ice Berg", "Cherry Tomato", "Garlic (Peeled)", "Ginger", "Pumpkin", "Celery", "Basil",
    "Sweet Corn (Frozen)", "Peas (Frozen)", "Sweet Potato", "Beetroot", "Cauliflower",
    "Cabbage", "Parseley", "Baby Corn", "Green Chilly", "Baby Spinach", "Spinach",
    "Bellpepper (Red,Yellow)", "Coriander", "Lettuce", "Spring Onion", "Kale"
];
export const packaging_items = [
    "750 ML Flat Round Paper Container", "500 ML Flat Round Paper Container", "350 ML Flat Round Paper Container",
    "100 ML Flat Round Paper Container", "Wooden Spork", "Sanitizer", "Tissue", "Straw Packed",
    "Glass Bottle 350 ML", "Glass Salsa Jar 350 ML", "Glass Salsa Jar 100 ML", "Carry Bag",
    "Burger Box", "Pizza Box 10\"", "Tape", "Sleeves", "ButterPaper", "Kot Roll"
];
export const mezza_items = [
    "Whole Wheat Pita", "beetroot roti", "beetroot wrap roti", "Spinach Patty", "Chop Masala",
    "ITALIAN GRAVY", "pizza sauce", "indian gravy", "Spinach Paste", "salsa sauce",
    "Hawaain Dressing", "chilly lime dressing", "Mint Sauce", "peanut sauce", "Truffles"
];
export const categoryMap = {
  Dairy: dairy_items,
  Poultry: poultry_items,
  Bakery: bakery_items,
  Grocery: grocery_items,
  Fruit: fruit_items,
  Vegetable: vegetable_items,
  Packaging: packaging_items,
  Mezza: mezza_items
};

export const allCategories = Object.keys(categoryMap);
