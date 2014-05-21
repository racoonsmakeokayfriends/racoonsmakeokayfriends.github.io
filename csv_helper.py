def read():
	f = open('tutorials.txt')
	lines = f.read().split('\n')
	tmp = ''
	for l in lines:
		tmp += l + '\\n'
	print tmp

read()