import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';

interface ProductAddState {
    justFileServiceResponse: string;
    formServiceResponse: string;
    fields: {};
    files: any[];
    images: any[];
    mainImage: string;
}
export class ProductAdd extends React.Component<RouteComponentProps<{}>, ProductAddState> {
    constructor(props) {
        super(props);

        this.uploadJustFile = this.uploadJustFile.bind(this);
        this.uploadForm = this.uploadForm.bind(this);
        this.filesOnChange = this.filesOnChange.bind(this);
        this.fieldOnChange = this.fieldOnChange.bind(this);

        this.state = {
            justFileServiceResponse: 'Click to upload!',
            formServiceResponse: 'Click to upload the form!',
            fields: {},
            files: [],
            images: [],
            mainImage: ''

        }

        this.showImages();

    }


    uploadJustFile(e) {
        e.preventDefault();
        let state = this.state;

        this.setState({
            ...state,
            justFileServiceResponse: 'Please wait'
        });

        if (!state.hasOwnProperty('files')) {
            this.setState({
                ...state,
                justFileServiceResponse: 'First select a file!',

            });
            return;
        }

        let form = new FormData();

        for (var index = 0; index < state.files.length; index++) {
            var element = state.files[index];
            form.append('file', element);
        }

        fetch('api/ProductDetail/UploadJustFile',
            {
                method: 'POST',
                body: form,
            }).then(response => response.json())
            .then(data => {
                this.setState((state) => {
                    return { mainImage: data.strImageUrl }
                });
                this.showImages();
            });
    }

    showImages() {
        fetch('api/ProductDetail/getImages')
            .then(response => response.json())
            .then(data => {
                this.setState((state) => {
                    return { images: data, mainImage: data.length > 0 ? data[0].strImageUrl : '' };
                });
                console.log(this.state.images);
            });

    }

    uploadForm(e) {
        e.preventDefault();
        let state = this.state;

        this.setState({
            ...state,
            formServiceResponse: 'Please wait'
        });

        if (!state.hasOwnProperty('files')) {
            this.setState({
                ...state,
                formServiceResponse: 'First select a file!'
            });
            return;
        }

        let form = new FormData();

        for (var key in state.fields) {
            if (state.fields.hasOwnProperty(key)) {
                var element = state.fields[key];
                form.append(key, element);
            }
        }

        fetch('api/ProductDetail/InsertProduct',
            {
                method: 'POST',
                body: form,
            }).then(response => response.json())
            .then(data => {
                console.log('yeeee');
                this.showImages();
            });

    }

    filesOnChange(sender) {
        let files = sender.target.files;
        let state = this.state;

        this.setState({
            ...state,
            files: files
        });
    }

    fieldOnChange(sender) {
        let fieldName = sender.target.name;
        let value = sender.target.value;
        let state = this.state;

        this.setState({
            ...state,
            fields: { ...state.fields, [fieldName]: value }
        });
    }

    public render() {
        return <div>
            <div className="page-header FocusHeader">
                <h1>Product Details</h1>
            </div>
            <section className="panel">
                    <div className="container panel-body">
                        <div className="row">
                            <div className="col-md-5">
                                <div className="single_product_thumb">
                                    <div id="product_details_slider" className="carousel slide" data-ride="carousel">
                                        <img src={this.state.mainImage} style={{ width: '400px' }} />


                                        {this.state.images.map(image =>
                                           
                                                <span className="carousel-item active">
                                                   
                                                <span className="w-100 text-center">
                                                    <img className="d-block w-100" src={image.strImageUrl} />
                                                    <label>x</label>
                                                    </span>
                                                </span>
                                           
                                        )}

                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="single_product_desc">
                                    <form>
                                        <div className="panel panel-success">
                                            <div className="panel-heading" >Product Photo Upload</div>
                                        <div className="panel-body">
                                            <input type="file" id="case-one" className="btn" onChange={this.filesOnChange} />
                                            <button type="button" onClick={this.uploadJustFile} className="btn btn-primary">Upload image</button>
                                            </div>
                                        </div>
                                    </form>
                                    <form className="form-horizontal">
                                        <div className="panel panel-success">

                                            <div className="panel-heading" >Product Details:</div>
                                            <div className="panel-body">

                                                <div className="form-group">
                                                    <label className="col-sm-4 control-label">Name</label>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" id="focusedInput" type="text" value="Product Name" name="productName" onChange={this.fieldOnChange} />                                                     
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label className="col-sm-4 control-label">Current Price</label>
                                                    <div className="col-sm-8">
                                                        <input type="number" className="form-control" id="qty" step="1" min="1" max="12" name="price"  onChange={this.fieldOnChange} />                                                      
                                                     </div>
                                                </div>    

                                                <div className="form-group">
                                                    <label className="col-sm-4 control-label">Quantity</label>
                                                    <div className="col-sm-8">                                                        
                                                        <input type="number" className="form-control" id="qty" step="1" min="1" max="12" name="quantity" key="test" value="1" onChange={this.fieldOnChange} />                                               
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label className="col-sm-4 control-label">Product Description</label>
                                                    <div className="col-sm-8"> 
                                                        <textarea className="form-control" placeholder="Product Description." name="productDetail" onChange={this.fieldOnChange}></textarea>
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label className="col-sm-4 control-label">Additional Information</label>
                                                    <div className="col-sm-8"> 
                                                        <textarea className="form-control" placeholder="Additional Information" name="aditionalInformation" onChange={this.fieldOnChange}></textarea>
                                                    </div>
                                                 </div>
                                                
                                                <div className="form-group">
                                                    <label className="col-sm-4 control-label">Available</label>
                                                    <div className="col-sm-8">
                                                        <label className="text-muted control-label">In Stock</label>
                                                    </div>
                                                </div>  

                                                <div className="form-group">
                                                    <label className="col-sm-4 control-label"></label>
                                                    <div className="col-sm-8">
                                                        <button type="text" className="btn btn-primary" onClick={this.uploadForm}>Upload form </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                     </form>
                                </div>
                            </div>
                        </div>
                    </div>
            </section>
        </div>;
    }
}
