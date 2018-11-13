import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse);
};

const parseCodeWithLoc = (codeToParse) => esprima.parseScript(codeToParse, {loc: true});

const buildTableOfElement = (codeToParse) =>{
    const tableData = buildModelGeneral(parseCodeWithLoc(codeToParse));  
    return sortTable(tableData);
};

const sortTable = (tableData) => tableData.sort((a,b)=>a.line<b.line);

const buildModelGeneral = (ast) =>
    !ast? []:
        ast.type==='Program' || ast.type==='BlockStatement'? buildModelProgram(ast):
            ast.type==='Literal'? buildModelLiteral(ast):
                buildDeclrations(ast);

const buildDeclrations = (ast) =>
    ast.type==='VariableDeclaration'? buildModelVariableDeclaration(ast):
        ast.type==='VariableDeclarator'? buildModelVariableDeclarator(ast):
            ast.type==='FunctionDeclaration'? buildModelFunctionDeclaration(ast):
                ast.type==='Identifier'?buildModelIdentifier(ast):
                    buildStatements(ast);

    
const buildStatements = (ast)=>
    ast.type==='ExpressionStatement'? buildModelExpressionStatement(ast):
        ast.type==='ForStatement'? buildModelForStatement(ast):
            ast.type==='ReturnStatement'? buildModelReturnStatement(ast):
                ast.type==='WhileStatement'? buildModelWhileStatement(ast):
                    buildExpressions (ast);

const buildExpressions = (ast) =>
    ast.type==='MemberExpression'? buildModelMemberExpression(ast):
        ast.type==='UnaryExpression'? buildModelUnaryExpression(ast):
            ast.type==='BinaryExpression'? buildModelBinaryExpression(ast):
                ast.type==='AssignmentExpression'? buildModelAssignmentExpression(ast):
                    buildOtherExpressions(ast);

const buildOtherExpressions = (ast) =>
    ast.type==='IfStatement'? buildModelIfStatement(ast):[];


const buildModelProgram = (ast) =>{
    let bodyNodes =ast.body.reduce((curr,next)=>[...curr,...buildModelGeneral(next)],[]);
    return [{line: ast.loc.start.line ,type: ast.type, name:'', value: ''} ,...bodyNodes];
};

const buildModelVariableDeclaration= (ast) =>{
    let declrator =ast.declarations.reduce((curr,next)=>[...curr,...buildModelGeneral(next)],[]);
    return [{line: ast.loc.start.line ,type: ast.type, name:'', value: ''} ,...declrator];
};

const buildModelVariableDeclarator= (ast) =>{
    let init = buildModelGeneral(ast.init);
    return [{line: ast.loc.start.line ,type: ast.type, name:ast.id.name, value: ''} ,...init];
};

const buildModelIfStatement= (ast) => {
    let test = buildModelGeneral(ast.test);
    let consequent = buildModelGeneral(ast.consequent);
    let alternative = buildModelGeneral(ast.alternative);
    return [{line: ast.loc.start.line ,type: ast.type, name:'', value: ''} ,...test,...consequent,...alternative];
};

const buildModelExpressionStatement= (ast) => {
    let expression = buildModelGeneral(ast.expression);
    return [{line: ast.loc.start.line ,type: ast.type, name:'', value: ''} ,...expression];
};

const buildModelBinaryExpression= (ast) => {
    let left = buildModelGeneral(ast.left);
    let right = buildModelGeneral(ast.right);
    return [{line: ast.loc.start.line ,type: ast.type, name:ast.operator, value: ''} ,...left,...right];
};

const buildModelAssignmentExpression= (ast) => {
    let left = buildModelGeneral(ast.left);
    let right = buildModelGeneral(ast.right);
    return [{line: ast.loc.start.line ,type: ast.type, name:ast.operator, value: ''} ,...left,...right];
};

const buildModelFunctionDeclaration = (ast) =>{
    let params = ast.params.reduce((curr,next)=>[...curr,...buildModelGeneral(next)],[]);
    let body = buildModelGeneral(ast.body); 
    return [{line: ast.loc.start.line ,type: ast.type, name:ast.id.name, value: ''} ,...params,...body];
};

const buildModelWhileStatement = (ast) =>{
    let test = buildModelGeneral(ast.test); 
    let body = buildModelGeneral(ast.body); 
    return [{line: ast.loc.start.line ,type: ast.type, name:'', value: ''} ,...test,...body];
};

const buildModelForStatement = (ast) =>{
    let init = buildModelGeneral(ast.init); 
    let test = buildModelGeneral(ast.test); 
    let update = buildModelGeneral(ast.update); 
    let body = buildModelGeneral(ast.body); 
    return [{line: ast.loc.start.line ,type: ast.type, name:'', value: ''} ,...init,...test,...update,...body];
};

const buildModelMemberExpression = (ast) =>{
    let object = buildModelGeneral(ast.object); 
    let property = buildModelGeneral(ast.property); 
    return [{line: ast.loc.start.line ,type: ast.type, name:'', value: ''} ,...object,...property];
};

const buildModelReturnStatement = (ast) =>{
    let argument = buildModelGeneral(ast.argument); 
    return [{line: ast.loc.start.line ,type: ast.type, name:'', value: ''} ,...argument];
};

const buildModelUnaryExpression = (ast) =>{
    let argument = buildModelGeneral(ast.argument);  
    return [{line: ast.loc.start.line ,type: ast.type, name:ast.operator, value: ''} ,...argument];
};

const buildModelIdentifier = (ast) => [{line: ast.loc.start.line ,type: ast.type, name:ast.name, value:''}];

const buildModelLiteral= (ast) => [{line: ast.loc.start.line ,type: ast.type, name:'', value: ast.value}];


export {parseCode, parseCodeWithLoc,buildTableOfElement,buildModelGeneral};