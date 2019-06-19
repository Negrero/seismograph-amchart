import sys, json
import numpy as np
# read data from stdin from child process from nodejs

data = ""
for line in sys.stdin:
    try:
        data += line
    except StopIteration:
        print('EOF')
#y = sys.argv[1]

array = json.loads(data)

#y = json.loads(data)
#print(array)

#data_der = np.gradient(array)
#dd = np.diff(array['t'])
array = np.gradient(np.array(array, dtype=float), 0.001250, axis=0)
#dy = np.diff(array['y'])
#dz = np.diff(array['z'])

d = np.array(array)

print(json.dumps(d.tolist()))
