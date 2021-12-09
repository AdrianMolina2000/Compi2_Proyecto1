export abstract class Node {
    line: Number;
    column : Number;
    public abstract execute(): any;

    constructor(line: Number, columns: Number) {
        this.line = line;
        this.column = columns;
    }
    
}