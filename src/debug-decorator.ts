import { DecorationOptions, ExtensionContext, window, workspace } from "vscode";
import { tokenizeDocument } from "./tokenizer";

let timeout: NodeJS.Timer | undefined = undefined;

const keywordDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#569cd6",
});

const controlKeywordDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#C586C0",
});

const entityDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#9CDCFE",
    fontWeight: "bold",
});

const typeDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#4EC9B0",
});

const functionDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#DCDCAA",
});

const variableDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#9CDCFE",
});

const metaDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#D4D4D4",
    fontWeight: "bold",
});

const commentDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#6A9955",
});

const stringDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#ce9178",
});

const constantDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#DCDCAA",
    fontWeight: "bold",
    //Constants and enums: "#4FC1FF"
});

const colorDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#9CDCFE",
});

const numberDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#b5cea8",
    //Constants and enums: "#4FC1FF"
});

const operatorDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#D4D4D4",
});

const characterDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#569cd6",
    backgroundColor: "#569cd633",
});

const specialCharacterDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#569cd6",
});

const escCharacterDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#d7ba7d",
});

const errorDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "dotted",
    borderColor: "#f44747",
    textDecoration: "underline wavy red 2px",
});

function updateDecorations() {
    let activeEditor = window.activeTextEditor;
    if (!activeEditor) {
        return;
    }

    const tokens = tokenizeDocument(activeEditor.document);

    const keywords: DecorationOptions[] = [];
    const controlKeywords: DecorationOptions[] = [];

    const types: DecorationOptions[] = [];
    const functions: DecorationOptions[] = [];
    const variables: DecorationOptions[] = [];
    const otherEntities: DecorationOptions[] = [];

    const comments: DecorationOptions[] = [];
    const strings: DecorationOptions[] = [];
    const otherMeta: DecorationOptions[] = [];

    const numbers: DecorationOptions[] = [];
    const colors: DecorationOptions[] = [];
    const otherConstants: DecorationOptions[] = [];

    const operators: DecorationOptions[] = [];
    const characters: DecorationOptions[] = [];
    const specialCharacters: DecorationOptions[] = [];
    const escCharacters: DecorationOptions[] = [];

    const errors: DecorationOptions[] = [];

    tokens.forEach((token) => {
        const content = activeEditor?.document.getText(token.range);

        const decoration: DecorationOptions = {
            range: token.range,
            hoverMessage: {
                language: "text",
                value: tokenTypeToStringMap[token.tokenType] + "(" + token.tokenType + "): {" + content?.replaceAll("\n", "\\n") + "}",
            },
        };

        switch (token.tokenType) {
            // Python statement keywords
            case KeywordTokenType.Init:
            case KeywordTokenType.Python:
            case KeywordTokenType.Hide:
            case KeywordTokenType.Early:
            case KeywordTokenType.Define:
            case KeywordTokenType.Default:

            // Renpy keywords
            case KeywordTokenType.Label:
            case KeywordTokenType.Play:
            case KeywordTokenType.Pause:
            case KeywordTokenType.Screen:
            case KeywordTokenType.Scene:
            case KeywordTokenType.Show:
            case KeywordTokenType.Image:
            case KeywordTokenType.Transform:

            // Renpy sub expression keywords
            case KeywordTokenType.Set:
            case KeywordTokenType.Expression:
            case KeywordTokenType.Sound:
            case KeywordTokenType.At:
            case KeywordTokenType.With:
            case KeywordTokenType.From:
            case KeywordTokenType.DollarSign:

            // Language keywords
            case ConstantTokenType.Boolean:
            case OperatorTokenType.And:
            case OperatorTokenType.Or:
            case OperatorTokenType.Not:
            case OperatorTokenType.Is:
            case OperatorTokenType.IsNot:
            case OperatorTokenType.In:
            case OperatorTokenType.NotIn:
                keywords.push(decoration);
                break;

            // Conditional control flow keywords
            case KeywordTokenType.If:
            case KeywordTokenType.Elif:
            case KeywordTokenType.Else:

            // Control flow keywords
            case KeywordTokenType.For:
            case KeywordTokenType.While:
            case KeywordTokenType.Pass:
            case KeywordTokenType.Return:
            case KeywordTokenType.Menu:
            case KeywordTokenType.Jump:
            case KeywordTokenType.Call:
                controlKeywords.push(decoration);
                break;

            // Types
            case EntityTokenType.Class:
            case EntityTokenType.Namespace:
                types.push(decoration);
                break;

            // Functions
            case EntityTokenType.Function:
                functions.push(decoration);
                break;

            // Variables
            case EntityTokenType.Variable:
                variables.push(decoration);
                break;

            // Other entities
            case EntityTokenType.Tag:
                otherEntities.push(decoration);
                break;

            // Comments
            case MetaTokenType.Comment:
                comments.push(decoration);
                break;

            case MetaTokenType.CommentCodeTag:
            case MetaTokenType.PythonLine:
            case MetaTokenType.PythonBlock:
            case MetaTokenType.Arguments:
            case MetaTokenType.TagBlock:
            case MetaTokenType.Placeholder:
            case MetaTokenType.Block:
            case MetaTokenType.EmptyString:
                otherMeta.push(decoration);
                break;

            // Strings
            case ConstantTokenType.String:
            case ConstantTokenType.UnquotedString:
                strings.push(decoration);
                break;

            // Colors
            case ConstantTokenType.Color:
                {
                    const colorDecoration: DecorationOptions = {
                        range: token.range,
                        hoverMessage: content,
                        renderOptions: {
                            before: { color: content },
                        },
                    };
                    colors.push(colorDecoration);
                }
                break;

            // Numbers
            case ConstantTokenType.Integer:
            case ConstantTokenType.Float:
                numbers.push(decoration);
                break;

            // Arithmatic operators
            case OperatorTokenType.Plus:
            case OperatorTokenType.Minus:
            case OperatorTokenType.Multiply:
            case OperatorTokenType.Divide:
            case OperatorTokenType.Modulo:
            case OperatorTokenType.Exponentiate:
            case OperatorTokenType.FloorDivide:

            // Bitwise operators
            case OperatorTokenType.BitwiseAnd:
            case OperatorTokenType.BitwiseOr:
            case OperatorTokenType.BitwiseXOr:
            case OperatorTokenType.BitwiseNot:
            case OperatorTokenType.BitwiseLeftShift:
            case OperatorTokenType.BitwiseRightShift:

            // Assignment operators
            case OperatorTokenType.Assign:
            case OperatorTokenType.PlusAssign:
            case OperatorTokenType.MinusAssign:
            case OperatorTokenType.MultiplyAssign:
            case OperatorTokenType.DivideAssign:
            case OperatorTokenType.ModuloAssign:
            case OperatorTokenType.ExponentiateAssign:
            case OperatorTokenType.FloorDivideAssign:
            case OperatorTokenType.BitwiseAndAssign:
            case OperatorTokenType.BitwiseOrAssign:
            case OperatorTokenType.BitwiseXOrAssign:
            case OperatorTokenType.BitwiseLeftShiftAssign:
            case OperatorTokenType.BitwiseRightShiftAssign:

            // Comparison operators
            case OperatorTokenType.Equals:
            case OperatorTokenType.NotEquals:
            case OperatorTokenType.GreaterThan:
            case OperatorTokenType.LessThan:
            case OperatorTokenType.GreaterThanEquals:
            case OperatorTokenType.LessThanEquals:
                operators.push(decoration);
                break;

            case CharacterTokenType.WhiteSpace:
            case CharacterTokenType.Colon:
            case CharacterTokenType.Semicolon:
            case CharacterTokenType.Comma:
            case CharacterTokenType.Hashtag:
            case CharacterTokenType.Quote:
            case CharacterTokenType.DoubleQuote:
            case CharacterTokenType.BackQuote:
            case CharacterTokenType.Backslash:
            case CharacterTokenType.NewLine:
                characters.push(decoration);
                break;

            case CharacterTokenType.OpenParentheses:
            case CharacterTokenType.CloseParentheses:
            case CharacterTokenType.OpenBracket:
            case CharacterTokenType.CloseBracket:
            case CharacterTokenType.OpenSquareBracket:
            case CharacterTokenType.CloseSquareBracket:
                specialCharacters.push(decoration);
                break;

            case EscapedCharacterTokenType.Escaped_Whitespace:
            case EscapedCharacterTokenType.Escaped_Newline:
            case EscapedCharacterTokenType.Escaped_Quote:
            case EscapedCharacterTokenType.Escaped_DoubleQuote:
            case EscapedCharacterTokenType.Escaped_Backslash:
            case EscapedCharacterTokenType.Escaped_OpenSquareBracket:
            case EscapedCharacterTokenType.Escaped_OpenBracket:
                escCharacters.push(decoration);
                break;

            case CharacterTokenType.Unknown:
            case MetaTokenType.Invalid:
                errors.push(decoration);
                break;
            default:
                throw new Error(`Unhandled token case: ${token.tokenType}`);
        }
    });

    activeEditor.setDecorations(keywordDecorationType, keywords);
    activeEditor.setDecorations(controlKeywordDecorationType, controlKeywords);

    activeEditor.setDecorations(typeDecorationType, types);
    activeEditor.setDecorations(functionDecorationType, functions);
    activeEditor.setDecorations(variableDecorationType, variables);
    activeEditor.setDecorations(entityDecorationType, otherEntities);

    activeEditor.setDecorations(commentDecorationType, comments);
    activeEditor.setDecorations(stringDecorationType, strings);
    activeEditor.setDecorations(metaDecorationType, otherMeta);

    activeEditor.setDecorations(constantDecorationType, otherConstants);
    activeEditor.setDecorations(numberDecorationType, numbers);
    activeEditor.setDecorations(colorDecorationType, colors);

    activeEditor.setDecorations(operatorDecorationType, operators);

    activeEditor.setDecorations(characterDecorationType, characters);
    activeEditor.setDecorations(specialCharacterDecorationType, specialCharacters);
    activeEditor.setDecorations(escCharacterDecorationType, escCharacters);

    activeEditor.setDecorations(errorDecorationType, errors);
}

function triggerUpdateDecorations(throttle = false) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
    }
    if (throttle) {
        timeout = setTimeout(updateDecorations, 500);
    } else {
        updateDecorations();
    }
}

export function registerDecorator(context: ExtensionContext) {
    triggerUpdateDecorations();

    // A TextDocument was changed
    context.subscriptions.push(
        workspace.onDidChangeTextDocument((event) => {
            let activeEditor = window.activeTextEditor;

            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations(true);
            }
        })
    );

    // The active text editor was changed
    context.subscriptions.push(
        window.onDidChangeActiveTextEditor(() => {
            triggerUpdateDecorations();
        })
    );
}

// NOTE: Everything below is defined solely for this debug decorator.
// None of this should be used outside of this file! This is for debug purposes only!
type AllTokenTypes = typeof KeywordTokenType & typeof EntityTokenType & typeof MetaTokenType & typeof ConstantTokenType & typeof OperatorTokenType & typeof CharacterTokenType & typeof EscapedCharacterTokenType;

type EnumToString<Type> = {
    [P in keyof Type]: { name: P; value: Type[P] };
};

const tokenTypeDefinitions: EnumToString<AllTokenTypes> = {
    Init: { name: "Init", value: KeywordTokenType.Init },
    Python: { name: "Python", value: KeywordTokenType.Python },
    Hide: { name: "Hide", value: KeywordTokenType.Hide },
    Early: { name: "Early", value: KeywordTokenType.Early },
    Define: { name: "Define", value: KeywordTokenType.Define },
    Default: { name: "Default", value: KeywordTokenType.Default },
    Label: { name: "Label", value: KeywordTokenType.Label },
    Play: { name: "Play", value: KeywordTokenType.Play },
    Pause: { name: "Pause", value: KeywordTokenType.Pause },
    Screen: { name: "Screen", value: KeywordTokenType.Screen },
    Scene: { name: "Scene", value: KeywordTokenType.Scene },
    Show: { name: "Show", value: KeywordTokenType.Show },
    Image: { name: "Image", value: KeywordTokenType.Image },
    Transform: { name: "Transform", value: KeywordTokenType.Transform },
    Set: { name: "Set", value: KeywordTokenType.Set },
    Expression: { name: "Expression", value: KeywordTokenType.Expression },
    Sound: { name: "Sound", value: KeywordTokenType.Sound },
    At: { name: "At", value: KeywordTokenType.At },
    With: { name: "With", value: KeywordTokenType.With },
    From: { name: "From", value: KeywordTokenType.From },
    DollarSign: { name: "DollarSign", value: KeywordTokenType.DollarSign },
    If: { name: "If", value: KeywordTokenType.If },
    Elif: { name: "Elif", value: KeywordTokenType.Elif },
    Else: { name: "Else", value: KeywordTokenType.Else },
    For: { name: "For", value: KeywordTokenType.For },
    While: { name: "While", value: KeywordTokenType.While },
    Pass: { name: "Pass", value: KeywordTokenType.Pass },
    Return: { name: "Return", value: KeywordTokenType.Return },
    Menu: { name: "Menu", value: KeywordTokenType.Menu },
    Jump: { name: "Jump", value: KeywordTokenType.Jump },
    Call: { name: "Call", value: KeywordTokenType.Call },

    Class: { name: "Class", value: EntityTokenType.Class },
    Namespace: { name: "Namespace", value: EntityTokenType.Namespace },
    Function: { name: "Function", value: EntityTokenType.Function },
    Tag: { name: "Tag", value: EntityTokenType.Tag },
    Variable: { name: "Variable", value: EntityTokenType.Variable },

    String: { name: "String", value: ConstantTokenType.String },
    UnquotedString: { name: "UnquotedString", value: ConstantTokenType.UnquotedString },
    Color: { name: "Color", value: ConstantTokenType.Color },
    Integer: { name: "Integer", value: ConstantTokenType.Integer },
    Float: { name: "Float", value: ConstantTokenType.Float },
    Boolean: { name: "Boolean", value: ConstantTokenType.Boolean },

    Plus: { name: "Plus", value: OperatorTokenType.Plus },
    Minus: { name: "Minus", value: OperatorTokenType.Minus },
    Multiply: { name: "Multiply", value: OperatorTokenType.Multiply },
    Divide: { name: "Divide", value: OperatorTokenType.Divide },
    Modulo: { name: "Modulo", value: OperatorTokenType.Modulo },
    Exponentiate: { name: "Exponentiate", value: OperatorTokenType.Exponentiate },
    FloorDivide: { name: "FloorDivide", value: OperatorTokenType.FloorDivide },
    BitwiseAnd: { name: "BitwiseAnd", value: OperatorTokenType.BitwiseAnd },
    BitwiseOr: { name: "BitwiseOr", value: OperatorTokenType.BitwiseOr },
    BitwiseXOr: { name: "BitwiseXOr", value: OperatorTokenType.BitwiseXOr },
    BitwiseNot: { name: "BitwiseNot", value: OperatorTokenType.BitwiseNot },
    BitwiseLeftShift: { name: "BitwiseLeftShift", value: OperatorTokenType.BitwiseLeftShift },
    BitwiseRightShift: { name: "BitwiseRightShift", value: OperatorTokenType.BitwiseRightShift },
    Assign: { name: "Assign", value: OperatorTokenType.Assign },
    PlusAssign: { name: "PlusAssign", value: OperatorTokenType.PlusAssign },
    MinusAssign: { name: "MinusAssign", value: OperatorTokenType.MinusAssign },
    MultiplyAssign: { name: "MultiplyAssign", value: OperatorTokenType.MultiplyAssign },
    DivideAssign: { name: "DivideAssign", value: OperatorTokenType.DivideAssign },
    ModuloAssign: { name: "ModuloAssign", value: OperatorTokenType.ModuloAssign },
    ExponentiateAssign: { name: "ExponentiateAssign", value: OperatorTokenType.ExponentiateAssign },
    FloorDivideAssign: { name: "FloorDivideAssign", value: OperatorTokenType.FloorDivideAssign },
    BitwiseAndAssign: { name: "BitwiseAndAssign", value: OperatorTokenType.BitwiseAndAssign },
    BitwiseOrAssign: { name: "BitwiseOrAssign", value: OperatorTokenType.BitwiseOrAssign },
    BitwiseXOrAssign: { name: "BitwiseXOrAssign", value: OperatorTokenType.BitwiseXOrAssign },
    BitwiseLeftShiftAssign: { name: "BitwiseLeftShiftAssign", value: OperatorTokenType.BitwiseLeftShiftAssign },
    BitwiseRightShiftAssign: { name: "BitwiseRightShiftAssign", value: OperatorTokenType.BitwiseRightShiftAssign },
    Equals: { name: "Equals", value: OperatorTokenType.Equals },
    NotEquals: { name: "NotEquals", value: OperatorTokenType.NotEquals },
    GreaterThan: { name: "GreaterThan", value: OperatorTokenType.GreaterThan },
    LessThan: { name: "LessThan", value: OperatorTokenType.LessThan },
    GreaterThanEquals: { name: "GreaterThanEquals", value: OperatorTokenType.GreaterThanEquals },
    LessThanEquals: { name: "LessThanEquals", value: OperatorTokenType.LessThanEquals },
    And: { name: "And", value: OperatorTokenType.And },
    Or: { name: "Or", value: OperatorTokenType.Or },
    Not: { name: "Not", value: OperatorTokenType.Not },
    Is: { name: "Is", value: OperatorTokenType.Is },
    IsNot: { name: "IsNot", value: OperatorTokenType.IsNot },
    In: { name: "In", value: OperatorTokenType.In },
    NotIn: { name: "NotIn", value: OperatorTokenType.NotIn },

    OpenParentheses: { name: "OpenParentheses", value: CharacterTokenType.OpenParentheses },
    CloseParentheses: { name: "CloseParentheses", value: CharacterTokenType.CloseParentheses },
    OpenBracket: { name: "OpenBracket", value: CharacterTokenType.OpenBracket },
    CloseBracket: { name: "CloseBracket", value: CharacterTokenType.CloseBracket },
    OpenSquareBracket: { name: "OpenSquareBracket", value: CharacterTokenType.OpenSquareBracket },
    CloseSquareBracket: { name: "CloseSquareBracket", value: CharacterTokenType.CloseSquareBracket },
    WhiteSpace: { name: "WhiteSpace", value: CharacterTokenType.WhiteSpace },
    Colon: { name: "Colon", value: CharacterTokenType.Colon },
    Semicolon: { name: "Semicolon", value: CharacterTokenType.Semicolon },
    Comma: { name: "Comma", value: CharacterTokenType.Comma },
    Hashtag: { name: "Hashtag", value: CharacterTokenType.Hashtag },
    Quote: { name: "Quote", value: CharacterTokenType.Quote },
    DoubleQuote: { name: "DoubleQuote", value: CharacterTokenType.DoubleQuote },
    BackQuote: { name: "BackQuote", value: CharacterTokenType.BackQuote },
    Backslash: { name: "Backslash", value: CharacterTokenType.Backslash },
    NewLine: { name: "NewLine", value: CharacterTokenType.NewLine },
    Unknown: { name: "Unknown", value: CharacterTokenType.Unknown },

    Escaped_Whitespace: { name: "Escaped_Whitespace", value: EscapedCharacterTokenType.Escaped_Whitespace },
    Escaped_Newline: { name: "Escaped_Newline", value: EscapedCharacterTokenType.Escaped_Newline },
    Escaped_Quote: { name: "Escaped_Quote", value: EscapedCharacterTokenType.Escaped_Quote },
    Escaped_DoubleQuote: { name: "Escaped_DoubleQuote", value: EscapedCharacterTokenType.Escaped_DoubleQuote },
    Escaped_Backslash: { name: "Escaped_Backslash", value: EscapedCharacterTokenType.Escaped_Backslash },
    Escaped_OpenSquareBracket: { name: "Escaped_OpenSquareBracket", value: EscapedCharacterTokenType.Escaped_OpenSquareBracket },
    Escaped_OpenBracket: { name: "Escaped_OpenBracket", value: EscapedCharacterTokenType.Escaped_OpenBracket },

    Comment: { name: "Comment", value: MetaTokenType.Comment },
    CommentCodeTag: { name: "CommentCodeTag", value: MetaTokenType.CommentCodeTag },
    PythonLine: { name: "PythonLine", value: MetaTokenType.PythonLine },
    PythonBlock: { name: "PythonBlock", value: MetaTokenType.PythonBlock },
    Arguments: { name: "Arguments", value: MetaTokenType.Arguments },
    TagBlock: { name: "TagBlock", value: MetaTokenType.TagBlock },
    Placeholder: { name: "Placeholder", value: MetaTokenType.Placeholder },
    Block: { name: "Block", value: MetaTokenType.Block },
    EmptyString: { name: "EmptyString", value: MetaTokenType.EmptyString },
    Invalid: { name: "Invalid", value: MetaTokenType.Invalid },
};

export const tokenTypeToStringMap = Object.fromEntries(Object.entries(tokenTypeDefinitions).map(([_, v]) => [v.value, v.name]));
