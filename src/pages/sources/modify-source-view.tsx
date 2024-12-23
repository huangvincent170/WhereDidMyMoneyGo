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
            <label>Source name: <input name="name" /></label><br />
            <label>Directory path: <input name="path" /></label><br />
            <label>Do files have a header line? <input type="checkbox" name="hasHeader" /></label><br />
            <label>Amount column index: <input name="amountIdx" /></label><br />
            <label>Is amount debt? <input type="checkbox" name="isDebt" /></label><br />
            <label>Date column index: <input name="dateIdx" /></label><br />
            <label>Description column index: <input name="descriptionIdx" /></label><br />
            <br />
            <button type="submit">Save Changes</button>
        </form>
        <button onClick={() => props.setShowModifySources(false)}>Close</button>
    </div>);
}