import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from posts_data import POSTS
with open(os.path.join(os.path.dirname(__file__),'posts_data.json'),'w',encoding='utf-8') as f:
    json.dump({str(k):v for k,v in POSTS.items()}, f, ensure_ascii=False, indent=2)
print('ok', len(POSTS))
