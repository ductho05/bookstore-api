from pymongo import MongoClient
import pandas as pd

uri = "mongodb+srv://anh:anh@cluster0.pcjkvwr.mongodb.net/ecomBook?retryWrites=true&w=majority"

def connect():
    try:
        client = MongoClient(uri)
        my_product_list = []

        client.admin.command("ping")
        print("Connection DB successfully")

        db = client["ecomBook"]
        product = db.products
        product_list = product.find()

        for product in product_list:
            my_product_list.append(product)
                

        df_products = pd.DataFrame(my_product_list)
        return df_products
        
    except Exception as e:
        raise Exception(
        "The following error occurred: ", e)
    finally:
        client.close()
