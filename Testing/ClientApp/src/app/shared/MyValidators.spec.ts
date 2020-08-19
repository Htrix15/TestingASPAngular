/* tslint:disable:no-unused-variable */
import { FormGroup, FormControl } from '@angular/forms';
import { MyValidators } from './MyValidators';


describe('MyValidators', () => {  
    let form = new FormGroup({input: new FormControl(null, MyValidators.validateEmptyText())});
    
    afterEach(()=>{form.reset();})
    
    it('should return error \'empty text\' if input empty string', () => {
        form.controls['input'].setValue("");
        expect(form.get('input').errors.emptyText).toBeDefined();
    });

    it('should return error \'empty text\' if input string there are only white space', () => {
        form.controls['input'].setValue("    ");
        expect(form.get('input').errors.emptyText).toBeDefined();
    });

    it('should not return error \'empty text\' if input string there are not only white space', () => {
        form.controls['input'].setValue("  t  ");
        expect(form.get('input').errors).toBeNull();
    });

});