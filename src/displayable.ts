// Displayable Class
"use strict";

export class Displayable {
    name: string;
    tag: string;
    imageType: string;
    definition: string;
    filename: string;
    location: number;

    constructor(name: string, imageType: string, definition: string, filename: string, location: number) {
        this.name = name;
        this.imageType = imageType;
        this.definition = definition;
        this.filename = filename;
        this.location = location;
        if (name.indexOf(" ") > 0) {
            this.tag = name.split(" ")[0];
        } else {
            this.tag = name;
        }
    }
}
