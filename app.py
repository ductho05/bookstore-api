from flask import Flask, request, jsonify, json

import contentBase
import connectionDB

app = Flask(__name__)
df_products = connectionDB.connect()

@app.route('/bookstore/api/v1/recommendations', methods=['POST'])
def get_recommendations():

    data = json.loads(request.data)
    print(data)
    title = data['title']
    limit = int(data['limit'])

    results = contentBase.contentBaseRecommended(df_products, title, limit)

    return jsonify({
        'status': True,
        'message': 'recommendations successfully',
        'data': results
    })

