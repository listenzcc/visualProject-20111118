# %%
import os

# %%
pwd = os.path.dirname(__file__)

# %%
names = os.listdir(os.path.join(pwd, 'icons'))

# %%
if __name__ == '__main__':
    lst = [f'mkImageSrc("./assets/icons/{e}")' for e in names]
    res = 'const Icons = [\n{}\n];'.format(',\n'.join(lst))
    print(res)
    print(res, file=open(os.path.join(pwd, 'useIcons.js'), 'w'))

# %%
