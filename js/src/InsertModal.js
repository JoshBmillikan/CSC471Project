import {useState} from "react";
import Modal from "react-modal";
/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {getData} from "./data";

export function InsertModal(rowNames, columnData, currentTable, setTableData, setLoading) {
    const [modalOpen, setModalOpen] = useState(false)
    Modal.setAppElement('#root');
    const insertFn = async () => {
        setLoading(true)
        const data = {
            table_name: currentTable[0],
            pkey_name: currentTable[1],
            column_data: columnData
        }
        const response = await fetch(
            "https://csc471f21-millikan-joshua.azurewebsites.net/api/index.php/create",
            {
                method: 'post',
                body: JSON.stringify(data),
            }
        )
        if (!response.ok) {
            alert(response.error())
        }
        await getData(currentTable, setTableData, setLoading)
    }
    return (
        <div>
            <button
                css={css`
                `}
                onClick={() => setModalOpen(true)}
            > +
            </button>
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                contentLabel="Enter new row"
                css={css`
                  align-content: center;
                  border: 1px solid black;
                  box-shadow: black;
                  position: absolute;
                  background: snow;
                  top: 20vh;
                  left: 40vh;
                  right: 40vh;
                  bottom: inherit;
                  margin: auto;
                  padding: 10vh;
                  width: 20vh;
                `}
            >
                Please enter columns for new row.

                <form
                    name="insert"
                    onSubmit={(it) => {
                        it.preventDefault()
                        const columnData = Array.from(document.forms["insert"].elements).filter((element) => {
                            return element.id !== 'submitButton'
                        }).map((element) => {
                            return element.value
                        })
                        setModalOpen(false)
                        insertFn()
                    }}
                >
                    {rowNames.rowNames.map((name) => {
                        return (
                            <div css={css`
                              display: block;
                            `}>
                                <label css={css`
                                  align-content: center;
                                  font-style: italic;
                                `}
                                >{name}</label>
                                <input
                                    type="text"
                                />
                            </div>
                        )
                    })}
                    <div css={css`height: 2vh;`}/>
                    <input
                        id='submitButton'
                        type="submit"
                        css={css`
                          color: white;
                          background: cornflowerblue;
                          float: right;
                        `}
                        value="Ok"
                    />
                </form>
                <div css={css`height: 2vh`}/>
            </Modal>
        </div>)
}
