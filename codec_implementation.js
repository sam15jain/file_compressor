// import { MinHeap } from './heap_implementation.js';
// export { Codec };
class MinHeap {
    constructor() {
        this.heap_array = [];
    }

    size() {
        return this.heap_array.length;
    }

    empty() {
        return (this.size() === 0);
    }

    push(value) {
        this.heap_array.push(value);
        this.up_heapify();
    }

    up_heapify() {
        var current_index = this.size() - 1;
        while (current_index > 0) {
            var current_element = this.heap_array[current_index];
            var parent_index = Math.trunc((current_index - 1) / 2);
            var parent_element = this.heap_array[parent_index];

            if (parent_element[0] < current_element[0]) {
                break;
            }
            else {
                this.heap_array[parent_index] = current_element;
                this.heap_array[current_index] = parent_element;
                current_index = parent_index;
            }
        }
    }

    top() {
        return this.heap_array[0];
    }

    pop() {
        if (this.empty() == false) {
            var last_index = this.size() - 1;
            this.heap_array[0] = this.heap_array[last_index];
            this.heap_array.pop();
            this.down_heapify();
        }
    }

    down_heapify() {
        var current_index = 0;
        var current_element = this.heap_array[0];
        while (current_index < this.size()) {
            var child_index1 = (current_index * 2) + 1;
            var child_index2 = (current_index * 2) + 2;
            // console.log("indexes",child_index1,child_index2,"heap_size",this.size());
            if (child_index1 >= this.size() && child_index2 >= this.size()) {
                break;
            }
            else if (child_index2 >= this.size()) {
                let child_element1 = this.heap_array[child_index1];
                if (current_element[0] < child_element1[0]) {
                    break;
                }
                else {
                    this.heap_array[child_index1] = current_element;
                    this.heap_array[current_index] = child_element1;
                    current_index = child_index1;
                }
            }
            else {
                var child_element1 = this.heap_array[child_index1];
                var child_element2 = this.heap_array[child_index2];
                if (current_element[0] < child_element1[0] && current_element[0] < child_element2[0]) {
                    break;
                }
                else {
                    if (child_element1[0] < child_element2[0]) {
                        this.heap_array[child_index1] = current_element;
                        this.heap_array[current_index] = child_element1;
                        current_index = child_index1;
                    }
                    else {
                        this.heap_array[child_index2] = current_element;
                        this.heap_array[current_index] = child_element2;
                        current_index = child_index2;
                    }
                }
            }
        }
    }
}

class Codec {
    // constructor() {
    //     this.codes = {};
    // }    
    /// dfs
    getCodes(node, curr_code) {
        /// is leaf node
        if (typeof (node[1]) === "string") {
            // this.codes.node[1] = curr_code;
            /// alternate way
            this.codes[node[1]] = curr_code;
            return;
        }

        /// go left 
        this.getCodes(node[1][0], curr_code + '0');
        /// go right
        this.getCodes(node[1][1], curr_code + '1');
    }

    /// make the humffman tree into a string
    make_string(node) {
        // console.log(typeof (node[1] === "string"));
        if (typeof (node[1]) === "string") {
            //    console.log('here');
            return "'" + node[1];
        }
        // console.log('ln 123');
        return '0' + this.make_string(node[1][0]) + '1' + this.make_string(node[1][1]);
    }
    /// make string into huffman tree
    make_tree(tree_string) {
        let node = [];
        if (tree_string[this.index] === "'") {
            this.index++;
            node.push(tree_string[this.index]);
            this.index++;
            return node;
        }
        this.index++;
        node.push(this.make_tree(tree_string)); // find and push left child
        this.index++;
        node.push(this.make_tree(tree_string)); // find and push right child
        return node;
    }

    encode(data) {
        this.heap = new MinHeap();

        var mp = new Map();
        for (let i = 0; i < data.length; i++) {
            if (mp.has(data[i])) {
                // console.log("here");
                let foo = mp.get(data[i]);
                mp.set(data[i], foo + 1);
            }
            else {
                // mp[data[i]] = 1;
                mp.set(data[i], 1);
            }
        }
        console.log("map size", mp.size);
        if (mp.size === 0) {
            let final_string = "zer#";
            let output_message = "Compression complete and file sent for download" + '\n' + "Compression Ratio : " + (data.length / final_string.length);
            return [final_string, output_message];
        }
        if (mp.size === 1) {
            let key, value;
            for (let [k, v] of mp) {
                key = k;
                value = v;
            }
            let final_string = "one" + '#' + key + '#' + value.toString();
            let output_message = "Compression complete and file sent for download" + '\n' + "Compression Ratio : " + (data.length / final_string.length);
            return [final_string, output_message];
        }
        console.log(mp)
        for (let [key, value] of mp) {
            this.heap.push([value, key]);
        }

        /// alternate way
        // mp.forEach(function (value, key) {
        //     console.log([value, key]);
        // })
        console.log(this.heap.heap_array);
        while (this.heap.size() >= 2) {
            // console.log("here");
            let min_node1 = this.heap.top();
            this.heap.pop();
            let min_node2 = this.heap.top();
            this.heap.pop();
            this.heap.push([min_node1[0] + min_node2[0], [min_node1, min_node2]]);
        }
        // console.log(this.heap.heap_array);
        var huffman_tree = this.heap.top();
        // console.log(huffman_tree);
        // console.log(huffman_tree[1]);
        // console.log(huffman_tree[1][0]);
        // console.log(huffman_tree[1][1]);
        this.heap.pop();
        this.codes = {};
        this.getCodes(huffman_tree, "");

        /// convert data into coded data
        let binary_string = "";
        for (let i = 0; i < data.length; i++) {
            binary_string += this.codes[data[i]];
        }
        // console.log(binary_string);
        let padding_length = (8 - (binary_string.length % 8)) % 8;
        for (let i = 0; i < padding_length; i++) {
            binary_string += '0';
        }
        // console.log(binary_string);
        let encoded_data = "";
        for (let i = 0; i < binary_string.length;) {
            let curr_num = 0;
            for (let j = 0; j < 8; j++, i++) {
                curr_num *= 2;
                curr_num += binary_string[i] - '0';
            }
            encoded_data += String.fromCharCode(curr_num);
        }
        console.log(encoded_data);
        let tree_string = this.make_string(huffman_tree);
        console.log(tree_string);
        let ts_length = tree_string.length;
        let final_string = ts_length.toString() + '#' + padding_length.toString() + '#' + tree_string + encoded_data;
        console.log(final_string);
        let output_message = "Compression complete and file sent for download" + '\n' + "Compression Ratio : " + (data.length / final_string.length);
        return [final_string, output_message];
    }

    decode(data) {
        // data = data.split('\n');
        // if (data.length === 4) {
        //     data[0] = data[0] + '\n' + data[1];
        //     data[1] = data[2];
        //     data[2] = data[3];
        //     data.pop();
        // }
        let k = 0;
        let temp = "";
        while (data[k] != '#') {
            temp += data[k];
            k++;
        }
        if (temp === "zer") {
            let decoded_data = "";
            let output_message = "Decompression complete and file sent for download";
            console.log(decoded_data);
            return [decoded_data, output_message];
        }
        if (temp === "one") {
            data = data.slice(k + 1);
            k = 0;
            temp = "";
            while (data[k] != '#') {
                temp += data[k];
                k++;
            }
            let one_char = temp;
            data = data.slice(k + 1);
            let str_len = parseInt(data);
            let decoded_data = "";
            for (let i = 0; i < str_len; i++) {
                decoded_data += one_char;
            }
            console.log(decoded_data);
            let output_message = "Decompression complete and file sent for download";
            return [decoded_data, output_message];

        }
        data = data.slice(k + 1);
        let ts_length = parseInt(temp);
        console.log("ts_length", ts_length);
        k = 0;
        temp = "";
        while (data[k] != '#') {
            temp += data[k];
            k++;
        }
        data = data.slice(k + 1);
        let padding_length = parseInt(temp);
        temp = "";
        for (k = 0; k < ts_length; k++) {
            temp += data[k];
        }
        data = data.slice(k);
        let tree_string = temp;
        console.log("tree_string", tree_string);
        temp = "";
        for (k = 0; k < data.length; k++) {
            temp += data[k];
        }
        let encoded_data = temp;
        this.index = 0;
        var huffman_tree = this.make_tree(tree_string);
        // console.log(huffman_tree);

        // let encoded_data = data[2];
        let binary_string = "";
        /// retrieve binary string from encoded data
        for (let i = 0; i < encoded_data.length; i++) {
            let curr_num = encoded_data.charCodeAt(i);
            let curr_binary = "";
            for (let j = 7; j >= 0; j--) {
                let foo = curr_num >> j;
                curr_binary = curr_binary + (foo & 1);
            }
            binary_string += curr_binary;
        }
        // let padding_length = data[1];
        // console.log("padding length",padding_length);
        // console.log(binary_string);

        /// remove padding
        binary_string = binary_string.slice(0, -padding_length);
        // console.log(binary_string);

        /// decode the data using binary string and huffman tree
        let decoded_data = "";
        let node = huffman_tree;
        for (let i = 0; i < binary_string.length; i++) {
            if (binary_string[i] === '1') {
                node = node[1];
            }
            else {
                node = node[0];
            }

            if (typeof (node[0]) === "string") {
                decoded_data += node[0];
                node = huffman_tree;
            }
        }
        console.log(decoded_data);
        let output_message = "Decompression complete and file sent for download";
        return [decoded_data, output_message];
    }
}

// let foo = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
// let foo = "sadvbsfds";
// let foo = "aaabbabababbabababababbaba";
// let foo = "aaaaaaaaaaaaaaaaaaaaaaaa"
let foo = "";
let fooobj = new Codec();
// console.log(fooobj.encode(foo));
let bar = fooobj.encode(foo);
console.log(bar[0]);
console.log(bar[1]);
let fooobj2 = new Codec();
let bar2 = fooobj2.decode(bar[0]);
console.log(bar2[0]);
console.log(bar2[1]);

