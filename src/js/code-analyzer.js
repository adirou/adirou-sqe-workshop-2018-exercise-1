import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse);
};

const parseCodeWithLoc = (codeToParse) => esprima.parseScript(codeToParse, {loc: true});

const buildTableOfElement = (codeToParse) =>{
    const tableData = buildModelGeneral(parseCodeWithLoc(codeToParse));  
    return sortTable(tableData);
};

const sortTable = (tableData) => tableData.sort((a,b) => a.line - b.line);

const statements = ['Program','BlockStatement','VariableDeclaration','VariableDeclarator',
    'FunctionDeclaration','IfStatement','ReturnStatement','WhileStatement',
    'ExpressionStatement','AssignmentExpression','ForStatement'];

const expressions = ['MemberExpression','UnaryExpression','BinaryExpression','updateExpression',
    'Identifier','Literal'];
const buildModelGeneral = (ast) =>
    !ast?[]:
        statements.includes(ast.type)? buildStatements(ast):
            expressions.includes(ast.type)? buildStringExpressions(ast):[];


const buildStatements = (ast) =>
    ast.type==='Program' || ast.type==='BlockStatement'? buildModelProgram(ast):
        ast.type==='VariableDeclaration'? buildModelVariableDeclaration(ast):
            ast.type==='VariableDeclarator'? buildModelVariableDeclarator(ast):
                buildStatements2(ast);

const buildStatements2 = (ast)=>
    ast.type==='FunctionDeclaration'? buildModelFunctionDeclaration(ast):
        ast.type==='IfStatement'? buildModelIfStatement(ast):
            ast.type==='ReturnStatement'? buildModelReturnStatement(ast):
                buildStatements3(ast);

const buildStatements3 = (ast)=>
    ast.type==='WhileStatement'? buildModelWhileStatement(ast):
        ast.type==='ExpressionStatement'? buildModelExpressionStatement(ast):
            ast.type==='ForStatement'? buildModelForStatement(ast):
                ast.type==='AssignmentExpression'? buildModelAssignmentExpression(ast):[];

const buildStringExpressions = (ast) =>
    !ast?'':
        ast.type==='MemberExpression'? buildStringMemberExpression(ast):
            ast.type==='UnaryExpression'? buildStringUnaryExpression(ast):
                ast.type==='BinaryExpression'? buildStringBinaryExpression(ast):
                    buildStringExpressions2(ast);

const buildStringExpressions2 = (ast)=>
    ast.type==='UpdateExpression'?buildStringUpdateExpression(ast):
        ast.type==='AssignmentExpression'? buildStringBinaryExpression(ast,true):
            ast.type==='Literal'? buildStringLiteral(ast):
                buildStringExpression3(ast);

const buildStringExpression3 =(ast)=>
    ast.type==='Identifier'?buildStringIdentifier(ast):
        ast.type==='VariableDeclaration'? buildModelVariableDeclaration(ast,true):
            ast.type==='VariableDeclarator'? buildModelVariableDeclarator(ast,true):'';



const buildModelProgram = (ast) =>ast.body.reduce((curr,next)=>[...curr,...buildModelGeneral(next)],[]);

const reducer= (curr,next)=>[...curr,...buildModelGeneral(next)];

const buildModelVariableDeclaration= (ast,toString=false) =>{
    return toString?ast.declarations.reduce((curr,next)=>`${curr} ${buildStringExpressions(next,true)}`,`${ast.kind}`):
        ast.declarations.reduce(reducer,[]);
};

const buildModelVariableDeclarator= (ast,toString=false) =>{
    let init = buildStringExpressions(ast.init);
    if(toString)
        return `${ast.id.name} = ${init}`;
    return [{line: ast.loc.start.line ,type: ast.type, name:ast.id.name, value: init,condition:''}];
};

const buildModelIfStatement= (ast) => {
    let test = buildStringExpressions(ast.test);
    let consequent = buildModelGeneral(ast.consequent);
    let alternate = buildModelGeneral(ast.alternate);
    return [{line: ast.loc.start.line ,type: ast.type, name:'', value: '',condition:test} ,...consequent,...alternate];
};

const buildModelExpressionStatement= (ast) => buildModelGeneral(ast.expression);


const buildModelAssignmentExpression= (ast) => {
    let left = buildStringExpressions(ast.left);
    let right = buildStringExpressions(ast.right);
    return [{line: ast.loc.start.line ,type: ast.type, name:left, value: right,condition:''}];
};


const buildModelFunctionDeclaration =(ast) => {
    let params = [];
    for(let i=0;i<ast.params.length;i++)
        params = [...params,{line:ast.loc.start.line, type:'VariableDeclration', name:ast.params[i].name,value:'',condition:''}];
    let body = buildModelGeneral(ast.body);
    return [{line: ast.loc.start.line ,type: ast.type, name:ast.id.name, value: '',condition:''} ,...params,...body];
};

const buildModelWhileStatement = (ast) =>{
    let test = buildModelGeneral(ast.test);
    let body = buildModelGeneral(ast.body);
    return [{line: ast.loc.start.line ,type: ast.type, name:'', value: '',condition:test} ,...body];
};

const buildModelForStatement = (ast) =>{
    let init = buildStringExpressions(ast.init); 
    let test = buildStringExpressions(ast.test); 
    let update = buildStringExpressions(ast.update); 
    let body = buildModelGeneral(ast.body); 
    return [{line: ast.loc.start.line ,type: ast.type, name:'', value: '',condition:`${init}; ${test}; ${update}`},...body];
};

const buildModelReturnStatement = (ast) =>{
    let argument = buildStringExpressions(ast.argument); 
    return [{line: ast.loc.start.line ,type: ast.type, name:'', value: argument,condition:''}];
};

const buildStringMemberExpression = (ast) =>{
    let object = buildStringExpressions(ast.object); 
    let property = buildStringExpressions(ast.property); 
    return `${object}[${property}]`;
};

const buildStringBinaryExpression= (ast,isAssignment=false) => {
    let left = buildStringExpressions(ast.left);
    let right = buildStringExpressions(ast.right);
    return `${left} ${isAssignment?'=':ast.operator} ${right}`;
};



const buildStringUnaryExpression = (ast) =>{
    let argument = buildStringExpressions(ast.argument);  
    return `${ast.operator}${argument}`;
};
const buildStringUpdateExpression = (ast) => {
    let argument = buildStringExpressions(ast.argument);  
    return `${argument}${ast.operator}`;
};
const buildStringIdentifier = (ast) => `${ast.name}`;

const buildStringLiteral= (ast) => `${ast.value}`;


export {parseCode,sortTable,reducer, parseCodeWithLoc,buildTableOfElement,buildModelGeneral,buildStringExpressions,buildStatements};