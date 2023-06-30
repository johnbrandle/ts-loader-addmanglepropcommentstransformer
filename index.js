/**
 * @license		MIT
 * @date		04.01.2023
 * @copyright   John Brandle
 * 
 * Any property with an access modifier that does not begin with an _ will be prefixed with Terser's @__MANGLE_PROP__ comment
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const ts = require('typescript');

class AddManglePropCommentsTransformer 
{
    _program;
    _context;

    constructor(program) 
    {
        this._program = program;
    }

    visitSourceFile(context, fileNode) 
    {
        this._context = context;

        return ts.visitNode(fileNode, this.#visitNode.bind(this));
    }

    #visitNode(node) 
    {
        const isMember = (node) => ts.isMethodDeclaration(node) || ts.isPropertyDeclaration(node) || ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node);
        
        if (isMember(node) && this.#explicitAccessModifierExists(node))
        {
            if (!node.name.escapedText.startsWith('_')) return ts.addSyntheticLeadingComment(node, ts.SyntaxKind.MultiLineCommentTrivia, '@__MANGLE_PROP__', true);
        }
        
        return ts.visitEachChild(node, this.#visitNode.bind(this), this._context);
    }

    #explicitAccessModifierExists(node)
    {
        const modifierExists = (node, modifier) => (node.modifiers || []).some((mod) => mod.kind === modifier);

        return modifierExists(node, ts.SyntaxKind.PublicKeyword) || modifierExists(node, ts.SyntaxKind.PrivateKeyword) || modifierExists(node, ts.SyntaxKind.ProtectedKeyword);
    }
}

module.exports = (program) =>
{
    let transfomer = new AddManglePropCommentsTransformer(program);

    return (context) => (node) => transfomer.visitSourceFile(context, node);
}
