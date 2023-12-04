/*
 *  Copyright 2016 Alexey Andreev.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import TeaVM from "./wasm/benchmark.wasm-runtime";

var Benchmark = function () {
    function Benchmark(board) {
        this.instance = null;
        //this.resultTableBody = document.getElementById("result-table-body");
        //this.list = createBoardDummy30();
        this.board = board;
    }
    Benchmark.prototype.load = async function () {
        var teavm = await TeaVM.wasm.load("wasm/benchmark.wasm", {
            installImports: installImports.bind(this),
        })
        this.instance = teavm.instance;
        teavm.main();
        console.log("after teavm.main()", this.board)
    };

    function installImports(o) {
        o.benchmark = {
            performanceTime: function () { return window.performance.now() || 0; },
            // reportPerformance: function (second, timeSpentComputing) {
            //     var row = document.createElement("tr");
            //     this.resultTableBody.appendChild(row);
            //     var secondCell = document.createElement("td");
            //     row.appendChild(secondCell);
            //     secondCell.appendChild(document.createTextNode(second.toString()));
            //     var timeCell = document.createElement("td");
            //     row.appendChild(timeCell);
            //     timeCell.appendChild(document.createTextNode(timeSpentComputing.toString()));
            // }.bind(this),
            repeatAfter: function (time) {
                setTimeout(tick.bind(this), time);
            }.bind(this),
            setBoard: function (row, col, val) {
                this.board[row][col] = val;
                //console.log("solved:", this.board);
            }.bind(this),
            readBoardElement: function (row, col) {
                return this.board[row][col]
            }.bind(this),
        };
    }

    function tick() {
        var exports = this.instance.exports;
        exports.tick();
        console.log("board in js", this.board)
        var exception = exports.teavm_catchException();
        if (exception !== 0) {
            console.log("Exception: " + exception);
        }
    }

    return Benchmark;
}();


export default Benchmark;