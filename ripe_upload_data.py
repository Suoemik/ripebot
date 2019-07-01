import csv
import json

# Open the CSV
f = open( 'Ripe_Expiration Date Information_Produce_5.21.19.csv', 'rU' )
# Change each fieldname to the appropriate field name. I know, so difficult.
reader = csv.DictReader( f, fieldnames = ("Item","Counter/ Pantry","Refrigerator","Freezer","Post Prinited Expiration date"))
# Parse the CSV into JSON
out = json.dumps( [ row for row in reader ] )
print("JSON parsed!")
# Save the JSON
f = open( 'Ripe_Expiration parsed.json', 'w')
f.write(out)
print("JSON saved!")
