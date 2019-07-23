import xlrd
from collections import OrderedDict
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
# Open the workbook and select the first worksheet
wb = xlrd.open_workbook('Ripe_Expiration Date Information.xlsx')
sh = wb.sheet_by_index(1)
# List to hold dictionaries
dairy_list = []
# Iterate through each row in worksheet and fetch values into dict
for rownum in range(1, sh.nrows):
    dairy_items = OrderedDict()
    row_values = sh.row_values(rownum)
    dairy_items['Opened or Unopened'] = row_values[0]
    dairy_items['Packaging Type ( Unrefrigerated vs Refrigerated)'] = row_values[1]
    dairy_items['Item'] = row_values[2]
    dairy_items['Counter or Pantry'] = row_values[3]
    dairy_items['Refrigerator'] = row_values[4]
    dairy_items['Freezer'] = row_values[5]
    dairy_items['Post Prinited Expiration date'] = row_values[6]
    dairy_list.append(dairy_items)
# Serialize the list of dicts to JSON
j = json.dumps(dairy_list)
# Write to file
with open('dairy_data.json', 'w') as f:
    f.write(j)

f.close()
with open('dairy_data.json', 'r') as p:
    dairy_json_dict = json.load(p)

print(dairy_json_dict[0])
cred = credentials.Certificate('./ripe-website-firebase-adminsdk-jj6qe-a38bc3f7ca-2.json')
firebase_admin.initialize_app(cred, {
    'databaseURL' : 'https://ripe-website.firebaseio.com'
})

root = db.reference('Dairy')

for i in dairy_json_dict:
    root.child(i['Item'].strip()).set(i)
