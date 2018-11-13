import assert from 'assert';
import {parseCode, parseCodeWithLoc , buildTableOfElement, buildModelGeneral} from '../src/js/code-analyzer';

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

describe('buildModels',()=>{
    it('buildModelGeneral with empty ast node',()=>{
        let ast = null;
        assert.equal(JSON.stringify(buildModelGeneral(ast)),JSON.stringify([]));
    });
    it('buildModelGeneral with program node',()=>{
        let ast ={type:'Program',body:[],loc:{start:{line:1}}};
        assertBuildModel(ast,'Program');
    });

    it('buildModelGeneral with blockstatment node',()=>{
        let ast ={type:'BlockStatement',body:[],loc:{start:{line:1}}};
        assertBuildModel(ast,'BlockStatement');
    });

    it('buildModelGeneral with VariableDeclaration node',()=>{
        let ast ={type:'VariableDeclaration',declarations:[],loc:{start:{line:1}}};
        assertBuildModel(ast,'VariableDeclaration');
    });

    it('buildModelGeneral with VariableDeclarator node',()=>{
        let ast ={type:'VariableDeclarator',init:null,id:{name:'x'},loc:{start:{line:1}}};
        assertBuildModel(ast,'VariableDeclarator',1,'x');
    });
    
    it('buildModelGeneral with IfStatement node',()=>{
        let ast = {type:'IfStatement', test:null , consequent:null, alternative:null,loc:{start:{line:1}}};
        assertBuildModel(ast,'IfStatement');
    });

        
    it('buildModelGeneral with ExpressionStatement node',()=>{
        let ast = {type:'ExpressionStatement', expression:null,loc:{start:{line:1}}};
        assertBuildModel(ast,'ExpressionStatement');
    });

    it('buildModelGeneral with BinaryExpression node',()=>{
        let ast = {type:'BinaryExpression', right:null,left:null,operator:'=',loc:{start:{line:1}}};
        assertBuildModel(ast,'BinaryExpression',1,'=');
    });

    it('buildModelGeneral with AssignmentExpression node',()=>{
        let ast = {type:'AssignmentExpression', right:null,left:null,operator:'=',loc:{start:{line:1}}};
        assertBuildModel(ast,'AssignmentExpression',1,'=');
    });

    it('buildModelGeneral with FunctionDeclaration node',()=>{
        let ast = {type:'FunctionDeclaration', params:[],body:null, id:{name:'func'}, loc:{start:{line:1}}};
        assertBuildModel(ast,'FunctionDeclaration',1,'func');
    });
    it('buildModelGeneral with WhileStatement node',()=>{
        let ast = {type:'WhileStatement', test:null,body:null, loc:{start:{line:1}}};
        assertBuildModel(ast,'WhileStatement');
    });

    it('buildModelGeneral with MemberExpression node',()=>{
        let ast = {type:'MemberExpression', object:null, property:null, loc:{start:{line:1}}};
        assertBuildModel(ast,'MemberExpression');
    });
    it('buildModelGeneral with ReturnStatement node',()=>{
        let ast = {type:'ReturnStatement', argument:null, loc:{start:{line:1}}};
        assertBuildModel(ast,'ReturnStatement');
    });
    it('buildModelGeneral with UnaryExpression node',()=>{
        let ast = {type:'UnaryExpression', argument:null,operator:'-', loc:{start:{line:1}}};
        assertBuildModel(ast,'UnaryExpression',1,'-');
    });
    it('buildModelGeneral with Identifier node',()=>{
        let ast = {type:'Identifier', name:'y', loc:{start:{line:1}}};
        assertBuildModel(ast,'Identifier',1,'y');
    });
    it('buildModelGeneral with For node',()=>{
        let ast = {type:'ForStatement',init:null,test:null,update:null,body:null, loc:{start:{line:1}}};
        assertBuildModel(ast,'ForStatement');
    });
    it('buildModelGeneral with Literal node',()=>{
        let ast = {type:'Literal',value:5, loc:{start:{line:1}}};
        assertBuildModel(ast,'Literal',1,'',5);
    });
    it('buildTableOfElement with Literal node',()=>{
        let table = buildTableOfElement('5');
        assert.deepEqual(table,[{line:1,type:'Program',name:'',value:''},{line:1,type:'ExpressionStatement',name:'',value:''},{line:1,type:'Literal',name:'',value:5}]);
    });
});


const assertBuildModel = (ast,type,line=1,name='',value='') => {
    let model = buildModelGeneral(ast);
    assert.equal(JSON.stringify([{line,type, name, value}]),JSON.stringify(model));
};