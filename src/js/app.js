import $ from 'jquery';
import {parseCode, buildTableOfElement} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let model = buildTableOfElement(codeToParse);
        let htmlToInsert = model.reduce((curr,next) => curr + generateRow(next),'');
        $('#content').html(htmlToInsert);
    });
});

const generateRow = (nodeProp) => `<tr> <td>${nodeProp.line}</td>  <td>${nodeProp.type}</td>  <td>${nodeProp.name}</td>  <td>${nodeProp.value}</td> </tr>`;
        
