//const Asciidoctor = require('@asciidoctor/core')
import Asciidoctor from '@asciidoctor/core' // (1)

const asciidoctor = Asciidoctor()

//const JupyterConverter = require('asciidoctor-jupyter')
import JupyterConverter from 'asciidoctor-jupyter'


//import plantuml from 'asciidoctor-plantuml';
//plantuml.register(asciidoctor.Extensions);
// register the converter
asciidoctor.ConverterFactory.register(JupyterConverter, ['jupyter'])

// convert an AsciiDoc file
asciidoctor.convertFile(
    'notebook.adoc', 
    { 
        backend: 'jupyter' , 
        safe: 'SAFE'
    }
)