import sys, json
from acoustics.octave import Octave
import numpy as np

f = sys.argv[1]
f = json.loads(f)

o = Octave(interval=f, fraction=3)

print(json.dumps(o.center.tolist()))