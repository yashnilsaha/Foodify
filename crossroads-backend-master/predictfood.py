import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import matplotlib.pyplot as plt
import json

model = tf.keras.models.load_model('./models/foodidentification.hdf5')


classes = ['apple_pie', 'baby_back_ribs', 'baklava', 'beef_carpaccio',
           'beef_tartare', 'beet_salad', 'beignets', 'bibimbap', 'bread_pudding',
           'breakfast_burrito', 'bruschetta', 'caesar_salad', 'cannoli', 'caprese_salad',
           'carrot_cake', 'ceviche', 'cheese_plate', 'cheesecake', 'chicken_curry', 'chicken_quesadilla',
           'chicken_wings', 'chocolate_cake', 'chocolate_mousse', 'churros', 'clam_chowder', 'club_sandwich',
           'crab_cakes', 'creme_brulee', 'croque_madame', 'cup_cakes', 'deviled_eggs', 'donuts', 'dumplings',
           'edamame', 'eggs_benedict', 'escargots', 'falafel', 'filet_mignon', 'fish_and_chips', 'foie_gras',
           'french_fries', 'french_onion_soup', 'french_toast', 'fried_calamari', 'fried_rice', 'frozen_yogurt',
           'garlic_bread', 'gnocchi', 'greek_salad', 'grilled_cheese_sandwich', 'grilled_salmon', 'guacamole', 'gyoza',
           'hamburger', 'hot_and_sour_soup', 'hot_dog', 'huevos_rancheros', 'hummus', 'ice_cream', 'lasagna', 'lobster_bisque',
           'lobster_roll_sandwich', 'macaroni_and_cheese', 'macarons', 'miso_soup', 'mussels', 'nachos', 'omelette', 'onion_rings',
           'oysters', 'pad_thai', 'paella', 'pancakes', 'panna_cotta', 'peking_duck', 'pho', 'pizza', 'pork_chop', 'poutine', 'prime_rib',
           'pulled_pork_sandwich', 'ramen', 'ravioli', 'red_velvet_cake', 'risotto', 'samosa', 'sashimi', 'scallops', 'seaweed_salad',
           'shrimp_and_grits', 'spaghetti_bolognese', 'spaghetti_carbonara', 'spring_rolls', 'steak', 'strawberry_shortcake', 'sushi',
           'tacos', 'takoyaki', 'tiramisu', 'tuna_tartare', 'waffles']

try:
    with open('food_data.json', 'r') as f:
        nutritional_data = json.load(f)
    food_info_map = {item['name']: item for item in nutritional_data}
except FileNotFoundError:
    print("Error: 'food_data.json' not found. Make sure it's in the same directory as the script.")
    food_info_map = {}


def predictfood(filename):
    img_ = image.load_img(filename, target_size=(228, 228))
    img_array = image.img_to_array(img_)
    img_processed = np.expand_dims(img_array, axis=0)
    img_processed /= 255.

    prediction = model.predict(img_processed)

    index = np.argmax(prediction)

    food = classes[index]
    food_details = food_info_map.get(food, "Details not found.")
    print(food)
    print(food_details)
    return [food, food_details]

print(predictfood('./testimages/test4.jpeg'))