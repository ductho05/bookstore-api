import json
from bson import json_util

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer


def combineFeatures(row):
    
    return str(row['title']) + ' ' + str(row['author']) + ' ' + str(row['categoryId']) + ' ' + str(row['desciption'])

def contentBaseRecommended(df_products, title, limit=10):

    # tạo danh sách sản phẩm bao gồm các cột muốn so sánh
    df_products['combine_product'] = df_products.apply(combineFeatures, axis=1)

    tfidf_vectorizer = TfidfVectorizer()
    
    # Tạo ma trận để so sánh
    tfidf_matrix_content = tfidf_vectorizer.fit_transform(df_products['combine_product'])

    #Tính toán độ giống nhau giữa các sản phẩm
    cosine_similarities_content = cosine_similarity(tfidf_matrix_content, tfidf_matrix_content)

    # Lấy index của sản phẩm muốn so sánh, lấy theo title
    item_index = df_products[df_products['title'] == title].index[0]

    # Lấy các similar giống sản phẩm của mình
    similar_items = list(enumerate(cosine_similarities_content[item_index]))

    # Sắp xếp các sản phẩm có độ giống nhau theo thứ tự giảm dần
    similar_items = sorted(similar_items, key=lambda x: x[1], reverse=True)

    # Lấy n similar giống nhất
    top_similar_items = similar_items[1:limit+2]

    # Lấy index của similar giống nhất
    recommended_item_indices = [x[0] for x in top_similar_items]

    # Lấy sản phẩm theo index similar
    recommended_items_details = df_products.iloc[recommended_item_indices]

    #Xóa cột combine trước khi trả về danh sách sản phẩm
    recommended_items_details = recommended_items_details.drop('combine_product', axis=1)

    filter_products = list(recommended_items_details.T.to_dict().values())
    filter_products.pop(0)
    for product in filter_products:
        product['_id'] = str(product['_id'])

    json_recommended_items = json_util.dumps(filter_products)

    return json.loads(json_recommended_items)
