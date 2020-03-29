import pandas as pd
import numpy as np
import joblib
import json

from app import app

from flask import render_template, request, redirect, url_for, session, jsonify


@app.route("/", methods=["GET", "POST"])
@app.route("/index", methods=["GET", "POST"])
def index():
	# Symptoms
    dis_sym = pd.read_csv('data/Training.csv')
    cols = dis_sym.columns[1:]
     
    return render_template('index.html', cols = cols)

@app.route("/predict",methods=['POST'])
def predict():
    if request.method == 'POST' :
        x = request.get_data().decode("utf-8")
        
        search = json.loads(x)['data']
        
        dis_sym = pd.read_csv('data/Training.csv')
        cols = dis_sym.columns[1:]

        clf = joblib.load('data/MES.pkl') # Load Model
        
        ## Feature Importances
        
        importances = clf.feature_importances_
        indices = np.argsort(importances)[::-1]

        features = cols
        
        ## Features sorted
        
        Fea_Dict = {}
        for i,f in enumerate(features):
              Fea_Dict[f] = i            # Features Dictionary
                
        ## Disease Prediction

        sample = np.zeros((len(features),), dtype=np.int)

        for i,s in enumerate(search):
              sample[Fea_Dict[s]] = 1

        sample_in = np.array(sample).reshape(1,len(sample))

        dis_pred_prob = pd.DataFrame(clf.predict_proba(sample_in), columns=clf.classes_)
        dis_pred_prob = dis_pred_prob[dis_pred_prob>0.0].dropna(axis=1)
        dis_pred_prob = dis_pred_prob.sort_values(axis=1, by= 0, ascending= False)
        
        
        d = dis_pred_prob.to_dict('split')
        d = dict((i,d[i]) for i in d.keys() if i!='index')
        
    return jsonify(d)