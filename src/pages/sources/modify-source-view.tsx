import { Source } from "../../classes/source";

export default function ModifySourcesView(props: {
    showModifySources: boolean,
    setShowModifySources: Function,
    sourceData: Source[],
    setSourceData: Function}
) {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        // Prevent the browser from reloading the page
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const source: Source = Source.fromFormData(formData);
        console.log(source);

        // todo validate data

        if (props.sourceData != null &&
            props.sourceData.some(existing => existing.name == source.name || existing.path == source.path)) {
            // todo user error
            console.log("source already exists!");
            return;
        }

        const newSourceData = props.sourceData == null ? [source] : props.sourceData.concat(source);
        props.setSourceData(newSourceData);
        props.setShowModifySources(!props.showModifySources);
    }

    // todo window modal for path
    // todo make popup look nice
    return (<div className="addView" hidden={!props.showModifySources}>
        <form className="addSourceForm" method="post" onSubmit={handleSubmit}>
            <div className="addSourceFieldContainer">
               <span>Source name:</span>
               <input name="name" />
            </div>
            <div className="addSourceFieldContainer">
               <span>Directory path:</span>
            <input name="path" />
            </div>
            <div className="addSourceFieldContainer">
               <span>Amount column index:</span>
                <input name="amountIdx" />
            </div>
            <div className="addSourceFieldContainer">
               <span>Date column index:</span>
                <input name="dateIdx" />
            </div>
            <div className="addSourceFieldContainer">
               <span>Description column index:</span>
                <input name="descriptionIdx" />
            </div>
            <div className="addSourceFieldContainer">
               <span>Is amount debt?</span>
                <input type="checkbox" name="isDebt" />
            </div>
            <div className="addSourceFieldContainer">
               <span>Do files have a header line?</span>
                <input type="checkbox" name="hasHeader" />
            </div>
            <div className="addViewFooter">
                <div className="addViewFooterRight">
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => props.setShowModifySources(false)}>Close</button>
                </div>
            </div>
        </form>
    </div>);
}