from pymongo import MongoClient
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import gridfs

client = MongoClient('mongodb+srv://sparta:test@cluster0.xi1pqvv.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta
application = app = Flask(__name__)
app.secret_key = 'any random string'


@app.route('/')
def home():
    id= session.get('id',None)
    return render_template('index.html',id=id)


@app.route('/write')
def write():
    if 'id' in session:
        id= session.get('id',None)
        return render_template('write.html',id=id)
    return render_template('login.html')


@app.route('/view')
def view():
    id= session.get('id',None)
    return render_template('index.html',id=id)


@app.route('/myview')
def myview():
    if 'id' in session:
        id= session.get('id',None)
        return render_template('myview.html',id=id)
    return render_template('login.html')


@app.route('/mypage')
def mypage():
    if 'id' in session:
        id= session.get('id',None)
        return render_template('mypage.html',id=id)
    return render_template('login.html')


@app.route('/join')
def join():
    return render_template('join.html')


@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        session['id'] = request.form['id']
        id= session.get('id',None)
        return render_template('index.html',id=id)
    return render_template('login.html')


@app.route('/logout', methods=["GET"])
def logout():
    session.pop('id', None)
    return render_template('index.html')


@app.route("/writediary", methods=['GET','POST'])
def writediary_post():
    if request.method == 'POST':
        id_receive = request.form['id_give']
        name_receive = request.form['name_give']
        comment_receive = request.form['comment_give']
        private_receive = request.form['private_give']
        emoji_receive = request.form['emoji_give']

        all_comments = list(db.diary.find({},{'_id':False}))
        count = len(all_comments) + 1

        doc = {
            'num':count,
            'id':id_receive,
            'name':name_receive,
            'comment':comment_receive,
            'private':private_receive,
            'emoji':emoji_receive,
        }
        db.diary.insert_one(doc)

        return jsonify({'msg': '전송완료!'})
    all_comments = list(db.diary.find({},{'_id':False}))
    return jsonify({'result': all_comments})


@app.route("/deletediary", methods=['POST'])
def deletediary():
    num_receive = request.form['num_give']

    doc = {
        'num':num_receive,
    }
    db.diary.delete_one(doc)

    return jsonify({'msg': '삭제완료!'})


@app.route("/upload", methods=['POST'])
def upload():
    img = request.files['image']

    ## GridFs를 통해 파일을 분할하여 DB에 저장하게 된다
    fs = gridfs.GridFS(db)
    fs.put(img, filename = 'name')

    ## file find ##
    data = client.grid_file.fs.files.find_one({'filename':'name'})

    ## file download ##
    my_id = data['_id']
    outputdata = fs.get(my_id).read()
    output = open('./images/'+'back.jpeg', 'wb')
    output.write(outputdata)
    return jsonify({'msg':'저장에 성공했습니다.'})


if __name__ == '__main__':
    app.run()