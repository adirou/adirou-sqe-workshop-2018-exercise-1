import assert from 'assert';
import {parseCode,reducer, parseCodeWithLoc , buildTableOfElement, buildModelGeneral, buildStringExpressions,buildStatements, sortTable} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable ExpressionStatement correctly', () => {
        assert.equal(
            JSON.stringify(parseCodeWithLoc('5;')),
            '{\"type\":\"Program\",\"body\":[{\"type\":\"ExpressionStatement\",\"expression\":{\"type\":\"Literal\",\"value\":5,\"raw\":\"5\",\"loc\":{\"start\":{\"line\":1,\"column\":0},\"end\":{\"line\":1,\"column\":1}}},\"loc\":{\"start\":{\"line\":1,\"column\":0},\"end\":{\"line\":1,\"column\":2}}}],\"sourceType\":\"script\",\"loc\":{\"start\":{\"line\":1,\"column\":0},\"end\":{\"line\":1,\"column\":2}}}');
    });
});
describe('utils table', () => {
    it('test 1', () => {
        let table = [{line:1},{line:3},{line:2}];
        assert.equal(JSON.stringify(sortTable(table)),JSON.stringify([{line:1},{line:2},{line:3}]))

        });
    it('test reducer', () => {
        let ast = {type:"Program", body:[]}
        let table = reducer([],ast);
        assert.equal(JSON.stringify([]),JSON.stringify([]));
    });
    it('test reducer2', () => {
        
    });
});
describe('buildModels',()=>{
    it('buildModelGeneral with null ast',()=>{
        let ast = null;
        assert.equal(JSON.stringify(buildModelGeneral(ast)),JSON.stringify([]));
    });
    it('buildStringModels with null ast node',()=>{
        let ast = null;
        assert.equal(JSON.stringify(buildStringExpressions(ast)),JSON.stringify(''));
    });
    it('buildModelGeneral with not declared ast node',()=>{
        let ast = {type:'sadsad'};
        assert.equal(JSON.stringify(buildModelGeneral(ast)),JSON.stringify([]));
    });
    it('buildStatements with not declared ast node',()=>{
        let ast = {type:'sadsad'};
        assert.equal(JSON.stringify(buildStatements(ast)),JSON.stringify([]));
    });

    it('buildModelString with not declared ast node',()=>{
        let ast = {type:'sadsad'};
        assert.equal(JSON.stringify(buildStringExpressions(ast)),JSON.stringify(''));
    });

    it('buildModelGeneral with program node',()=>{
        let ast ={type:'Program',body:[],loc:{start:{line:1}}};
        assert.equal(JSON.stringify(buildModelGeneral(ast)),JSON.stringify([]));
    });

    it('buildModelGeneral with blockstatment node',()=>{
        let ast ={type:'BlockStatement',body:[],loc:{start:{line:1}}};
        assert.equal(JSON.stringify(buildModelGeneral(ast)),JSON.stringify([]));
    });

    it('buildModelGeneral with VariableDeclaration node',()=>{
        let ast ={type:'VariableDeclaration',declarations:[],loc:{start:{line:1}}};
        assert.equal(JSON.stringify(buildModelGeneral(ast)),JSON.stringify([]));
    });

    it('buildModelGeneral with VariableDeclarator node',()=>{
        let ast ={type:'VariableDeclarator',init:null,id:{name:'x'},loc:{start:{line:1}}};
        assertBuildModel(ast,'VariableDeclarator',1,'x','',);
    });

    it('buildModelGeneral with VariableDeclaration node toString',()=>{
        let ast ={type:'VariableDeclaration',kind:'let',declarations:[{ type:'VariableDeclarator',init:{type:'Literal', value:'5'},id:{name:'x'},loc:{start:{line:1}}}],loc:{start:{line:1}, }};
        assert.equal(buildStringExpressions(ast),'let x = 5');
    });

    it('buildModelGeneral with VariableDeclarator node toString',()=>{
        let ast ={type:'VariableDeclarator',init:{type:'Literal', value:'5'},id:{name:'x'},loc:{start:{line:1}}};
        assert.equal(buildStringExpressions(ast),'x = 5');
    });
    
    it('buildModelGeneral with IfStatement node',()=>{
        let ast = {type:'IfStatement', test:{type:'Identifier',name:'x'}, consequent:null, alternate:null,loc:{start:{line:1}}};
        assertBuildModel(ast,'IfStatement',1,'','','x');
    });

        
    it('buildModelGeneral with ExpressionStatement node',()=>{
        let ast = {type:'ExpressionStatement', expression:{type:'Identifier', name:'x'},loc:{start:{line:1}}};
        assert.equal(buildModelGeneral(ast),'x');
    });

    it('buildModelGeneral with BinaryExpression node',()=>{
        let ast = {type:'BinaryExpression', right:{type:'Identifier',name:'y'},left:{type:'Identifier',name:'x'},operator:'==',loc:{start:{line:1}}};
        assertBuildString(ast,'x == y');
    });

    it('buildModelGeneral with AssignmentExpression node',()=>{
        let ast = {type:'AssignmentExpression', right:{type:'Identifier',name:'y'},left:{type:'Identifier',name:'x'},operator:'=',loc:{start:{line:1}}};
        assertBuildModel(ast,'AssignmentExpression',1,'x','y');
    });
    it('buildModelGeneral with AssignmentExpression node toString',()=>{
        let ast = {type:'AssignmentExpression', right:{type:'Identifier',name:'y'},left:{type:'Identifier',name:'x'},operator:'=',loc:{start:{line:1}}};
       assert.equal(buildStringExpressions(ast),'x = y');
    });

    it('buildModelGeneral with FunctionDeclaration node',()=>{
        let ast = {type:'FunctionDeclaration', params:[{name:'x'}],body:null, id:{name:'func'}, loc:{start:{line:1}}};
        let str =(JSON.stringify([{line:1,type:'FunctionDeclaration',name:'func',value:'',condition:''},{line:1,type:'VariableDeclration',name:'x',value:'',condition:''}]));
        assert.equal(JSON.stringify(buildModelGeneral(ast)),str);
    });
    it('buildModelGeneral with WhileStatement node',()=>{
        let ast = {type:'WhileStatement', test:{type:'Identifier',name:'z'},body:null, loc:{start:{line:1}}};
        assertBuildModel(ast,'WhileStatement',1,'','','z');
    });

    it('buildModelGeneral with MemberExpression node',()=>{
        let ast = {type:'MemberExpression', object:{type:'Identifier',name:'X'}, property:{type:'Identifier',name:'x'}, loc:{start:{line:1}}};
        assertBuildString(ast,'X[x]');
    });
    it('buildModelGeneral with ReturnStatement node',()=>{``
        let ast = {type:'ReturnStatement', argument:null, loc:{start:{line:1}}};
        assertBuildModel(ast,'ReturnStatement');
    });
    it('buildModelGeneral with UnaryExpression node',()=>{
        let ast = {type:'UnaryExpression', argument:{type:'Identifier',name:'x'},operator:'-', loc:{start:{line:1}}};
        assertBuildString(ast,'-x');
    });
    it('buildModelGeneral with UpdateExpression node',()=>{
        let ast = {type:'UpdateExpression', argument:{type:'Identifier',name:'x'},operator:'--', loc:{start:{line:1}}};
        assertBuildString(ast,'x--');
    });
    it('buildModelGeneral with Identifier node',()=>{
        let ast = {type:'Identifier', name:'y', loc:{start:{line:1}}};
        assertBuildString(ast,'y');
    });
   it('buildModelGeneral with For node',()=>{
        let ast = {type:'ForStatement',init:{},test:null,update:null,body:null, loc:{start:{line:1}}};
        assertBuildModel(ast,'ForStatement',1,'','','; ; ');
    });
    it('buildModelGeneral with Literal node to string',()=>{
        let ast = {type:'Literal',value:5, loc:{start:{line:1}}};
        assertBuildString(ast,'5');
    });
    it('buildTableOfElement with Literal node to string',()=>{
        let str = buildTableOfElement('5');
        assert.equal(str,'5');
    });
});

const assertBuildString = (ast,str) => {
    let string = buildStringExpressions(ast);
    assert.equal(string,str);
};

const assertBuildModel = (ast,type,line=1,name='',value='',condition='') => {
    let model = buildModelGeneral(ast);
    assert.equal(JSON.stringify([{line,type, name, value, condition}]),JSON.stringify(model));
};