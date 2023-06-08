from pymongo import MongoClient
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import gridfs

client = MongoClient('mongodb+srv://sparta:test@cluster0.xi1pqvv.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta
application = app = Flask(__name__)
app.secret_key = 'any random string'


@app.route('/')
def home():
    id = session.get('id', None)
    return render_template('index.html', id=id)


@app.route('/write')
def write():
    if 'id' in session:
        id = session.get('id', None)
        return render_template('write.html', id=id)
    return render_template('login.html')


@app.route('/view')
def view():
    id = session.get('id', None)
    return render_template('index.html', id=id)


@app.route('/myview')
def myview():
    if 'id' in session:
        id = session.get('id', None)
        return render_template('myview.html', id=id)
    return render_template('login.html')


@app.route('/myview2')
def myview2():
    if 'id' in session:
        id = session.get('id', None)
        return render_template('myview2.html', id=id)
    return render_template('login.html')


@app.route('/mypage')
def mypage():
    if 'id' in session:
        id = session.get('id', None)
        return render_template('mypage.html', id=id)
    return render_template('login.html')


@app.route('/join')
def join():
    return render_template('join.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['id'] = request.form['id']
        id = session.get('id', None)
        return render_template('index.html', id=id)
    return render_template('login.html')


@app.route('/logout', methods=["GET"])
def logout():
    session.pop('id', None)
    return render_template('index.html')


@app.route("/write_diary", methods=['GET', 'POST'])
def write_diary():
    if request.method == 'POST':
        id_receive = request.form['id_give']
        name_receive = request.form['name_give']
        content_receive = request.form['content_give']
        private_receive = request.form['private_give']
        emoji_receive = request.form['emoji_give']

        all_comments = list(db.diary.find({}, {'_id': False}))
        count = len(all_comments) + 1

        doc = {
            'num': count,
            'id': id_receive,
            'name': name_receive,
            'content': content_receive,
            'private': private_receive,
            'emoji': emoji_receive,
        }
        db.diary.insert_one(doc)

        return jsonify({'msg': '전송완료!'})
    all_comments = list(db.diary.find({}, {'_id': False}))
    return jsonify({'result': all_comments})


@app.route("/write_comment", methods=['POST'])
def write_comment():
    comment_receive = request.form['comment_give']
    num_receive = request.form['num_give']
    wid_receive = request.form['wid_give']

    all_comments = list(db.comment.find({}, {'_id': False}))
    if len(all_comments) == 0:
        count=1
    else :
        count = all_comments[len(all_comments)-1]['id']+1
        print(count)

    doc = {
        'num': num_receive,
        'id': count,
        'wid': wid_receive,
        'comment': comment_receive,
    }
    db.comment.insert_one(doc)
    return jsonify({'msg': '전송완료!'})


@app.route("/show_comments", methods=['POST'])
def show_comments():
    num_receive = request.form['num_give']
    all_comments = list(db.comment.find({"num":num_receive}, {'_id': False}))
    # 받은 게시판 넘버로 해당하는 모든 댓글을 끌고와서 반환
    return jsonify({'result': all_comments})


@app.route("/show_comment", methods=['POST'])
def show_comment():
    id_receive = request.form['id_give']
    comment = db.comment.find_one({"id":int(id_receive)}, {'_id': False})
    print(comment)
    # 받은 댓글 넘버로 해당하는 댓글을 끌고와서 반환
    return jsonify({'result': comment})


@app.route("/update_comment", methods=['POST'])
def update_comment():
    id_receive = request.form['id_give']
    comment_receive = request.form['comment_give']
    print(id_receive)
    print(comment_receive)
    db.comment.update_one({'id': int(id_receive)}, {'$set':{'comment': comment_receive}})
    # 받은 댓글 넘버로 해당하는 댓글을 끌고와서 반환
    return jsonify({'msg': '수정완료'})


@app.route("/delete_comment", methods=['POST'])
def delete_comment():
    id_receive = request.form['id_give']

    doc = {
        'id': id_receive,
    }
    db.comment.delete_one(doc)

    return jsonify({'msg': '삭제완료!'})


if __name__ == '__main__':
    app.run()
