lno.%: %
	sed 's/^/s=new Error().lineNumber; /' $< > $@
