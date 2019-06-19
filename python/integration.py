import sys, json
import numpy as np
import scipy.integrate as integrate

#x = sys.argv[1]
#y = sys.argv[2]
#x = json.loads(x)
#y = json.loads(y)

#y_int = integrate.cumtrapz(y, x, initial=0)

#print(json.dumps(y_int.tolist()))

data = ""
for line in sys.stdin:
    try:
        data += line
    except StopIteration:
        print('EOF')

array = json.loads(data)
x = np.array(array['x'], dtype=float)
y = np.array(array['y'], dtype=float)
z = np.array(array['z'], dtype=float)

intex = integrate.cumtrapz(x, dx=0.001250,axis=0, initial=0)
intey = integrate.cumtrapz(y, dx=0.001250,axis=0, initial=0)
intez = integrate.cumtrapz(z, dx=0.001250,axis=0, initial=0)
x = intex.tolist()
y = intey.tolist()
z= intez.tolist()
obj = {
    'x': x,
    'y': y,
    'z': z
}

print(json.dumps(obj))
