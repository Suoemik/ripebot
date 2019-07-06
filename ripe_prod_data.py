<<<<<<< HEAD
import xlrd
from collections import OrderedDict
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
# Open the workbook and select the first worksheet
wb = xlrd.open_workbook('Ripe_Expiration Date Information.xlsx')
sh = wb.sheet_by_index(0)
# List to hold dictionaries
prod_list = []
# Iterate through each row in worksheet and fetch values into dict
for rownum in range(1, sh.nrows):
    prod_items = OrderedDict()
    row_values = sh.row_values(rownum)
    prod_items['Item'] = row_values[0]
    prod_items['Counter or Pantry'] = row_values[1]
    prod_items['Refrigerator'] = row_values[2]
    prod_items['Freezer'] = row_values[3]
    prod_items['Post Prinited Expiration date'] = row_values[4]
    prod_list.append(prod_items)
# Serialize the list of dicts to JSON
j = json.dumps(prod_list)
# Write to file
with open('prod_data.json', 'w') as f:
    f.write(j)

f.close()
with open('prod_data.json', 'r') as p:
    prod_json_dict = json.load(p)

print(prod_json_dict[0])
cred = credentials.Certificate('./ripe-website-firebase-adminsdk-jj6qe-a38bc3f7ca-2.json')
firebase_admin.initialize_app(cred, {
    'databaseURL' : 'https://ripe-website.firebaseio.com'
})

root = db.reference('Produce')


root.set(prod_json_dict)
=======
import xlrd
from collections import OrderedDict
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
# Open the workbook and select the first worksheet
wb = xlrd.open_workbook('Ripe_Expiration Date Information.xlsx')
sh = wb.sheet_by_index(0)
# List to hold dictionaries
prod_list = []
# Iterate through each row in worksheet and fetch values into dict
for rownum in range(1, sh.nrows):
    prod_items = OrderedDict()
    row_values = sh.row_values(rownum)
    prod_items['Item'] = row_values[0]
    prod_items['Counter or Pantry'] = row_values[1]
    prod_items['Refrigerator'] = row_values[2]
    prod_items['Freezer'] = row_values[3]
    prod_items['Post Prinited Expiration date'] = row_values[4]
    prod_list.append(prod_items)
# Serialize the list of dicts to JSON
j = json.dumps(prod_list)
# Write to file
with open('prod_data.json', 'w') as f:
    f.write(j)

f.close()
with open('prod_data.json', 'r') as p:
    prod_json_dict = json.load(p)

print(prod_json_dict[0])
cred = credentials.Certificate('./ripe-website-firebase-adminsdk-jj6qe-a38bc3f7ca-2.json')
firebase_admin.initialize_app(cred, {
    'databaseURL' : 'https://ripe-website.firebaseio.com'
})

root = db.reference('Produce')


root.set(prod_json_dict)
>>>>>>> ec4ec59ff534e534455e195a47206cafe00dbf67
