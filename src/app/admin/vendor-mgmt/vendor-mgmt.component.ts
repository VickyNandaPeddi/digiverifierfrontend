import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-vendor-mgmt',
  templateUrl: './vendor-mgmt.component.html',
  styleUrls: ['./vendor-mgmt.component.scss']
})


export class VendorMgmtComponent implements OnInit {
    pageTitle = 'Customers Bill';
    vendoruser:any
    userID: any;
    getbgv: any=[];
    getBillValues: any=[];
    VendorData_stat:boolean=false;
    getVendorID: any=[];
    getCustomerBillData:any;
    vendorlist = new FormGroup({
      // organizationIds: new FormControl('', Validators.required),
      vendorIds: new FormControl(''),
      userId: new FormControl('', Validators.required)
    });
    constructor( private customers:CustomerService, private router:ActivatedRoute, private fb: FormBuilder,authService: AuthenticationService, private navRouter: Router) {
      this.userID = this.router.snapshot.paramMap.get('userId');
      // console.log(this.userID,"-----------------------------------")
      if(authService.roleMatch(['ROLE_ADMIN'])){
        console.log(localStorage.getItem('orgID'),"------------------org id")
        this.customers.getVendorList(localStorage.getItem('orgID')).subscribe((data: any)=>{
          this.getVendorID=data.data;
          console.log(this.getVendorID,"-------------vendoy----------------");
          if(this.userID){ 
            for (var index in this.getVendorID){
                console.log(this.getVendorID[index]["userId"],"indexxxxxxxxxxxxxxxxxxxx");
                if(this.userID==this.getVendorID[index]["userId"]){
                  console.log(this.userID,"final")
                  this.vendoruser=this.getVendorID[index]["userFirstName"]
                  console.log(this.vendoruser,"finaluser")
                }

            }
        }
          // if(this.userID){
          //     if (this.userID== item.)
          // }
        });
        console.log(this.vendorlist.value,"-------------vend----------------");
       
      }
      let rportData = {
        'userId': localStorage.getItem('userId')
      }
      
      this.customers.getSources().subscribe((data: any)=>{
        this.getbgv=data.data;
        this.getbgv.forEach((element:any) => {
          element.serviceId = '';
          element.ratePerItem = '';
          element.ratePerItem = '';

        });
      });
    if(this.userID){

      this.customers.getAllVendorServices(this.userID).subscribe((data: any)=>{
        console.log("--------------------calling service--------------")
        this.getBillValues=data.data;
        console.log(this.getBillValues,"--------------------")
        if(this.getBillValues){
          this.getBillValues.forEach((element:any) => {
            const billrpp = document.querySelector(".billrpp" + element.source?.sourceId) as HTMLInputElement;
            const billrpi = document.querySelector(".billrpi" + element.source?.sourceId) as HTMLInputElement;
            const billServiceId = document.querySelector(".billServiceId" + element.source?.sourceId) as HTMLInputElement;      
            if (billrpp) {
              billrpp.value = element.ratePerReport;
            }
            if (billrpi) {
              billrpi.value = element.ratePerItem;
            }
            if (billServiceId) {
              billServiceId.value = element.serviceId;
            }
          });
        }
  
      });
    }
      
    }
    getvendorid(id:any){
      this.getvendorid = id;
      let agentIdsArray: any=[];
      agentIdsArray.push(id);
      this.getvendorid = agentIdsArray;
      
    }
    onKeyUp(){
     this.VendorData_stat = false;
    }
    ngOnInit(): void {
       
    }
    billsubmit() {
      let billValue = document.querySelectorAll(".x-billcomponents");
      let i = 0;
      billValue.forEach(function (elem) {
        if (elem instanceof HTMLInputElement && elem.value !== "") {
          i++;
        }
      });
      if (i > 0) {
        this.onSubmit();
      }
    }
    onSubmit() {
      console.log(this.getbgv,"------------------submit----------------")
      console.log(this.vendorlist.value.vendorIds,"---------------------getvendor")
      console.log(this.vendorlist.value,"----------------------------------------")
      const formData = new FormData();
      return this.customers.saveVendorChecks(this.getbgv,this.vendorlist.value.vendorIds).subscribe((result:any)=>{
        console.log(result);
        if(result.outcome === true){
          Swal.fire({
            title: result.message,
            icon: 'success'
          }).then((result) => {
            if (result.isConfirmed) {
              const navURL = 'admin/addvendor';
              this.navRouter.navigate([navURL]);
            }
          });
        }else{
          Swal.fire({
            title: result.message,
            icon: 'warning'
          })
        }
      });
    }
      billUpdate() {
        console.log("______________inside button ------------------")
        this.getBillValues.forEach((element:any) => {
        const ratePerReport = document.querySelector(".billrpp" + element.source.sourceId) as HTMLInputElement;
        const ratePerItem = document.querySelector(".billrpi" + element.source.sourceId) as HTMLInputElement;
        const serviceId = document.querySelector(".billServiceId" + element.source.sourceId) as HTMLInputElement;
      
        if (ratePerReport && ratePerItem && serviceId) {
          element.ratePerReport = ratePerReport.value;
          console.log(element.ratePerReport);
          element.ratePerItem = ratePerItem.value;
          console.log(element.ratePerItem);
          element.serviceId = serviceId.value;
          console.log(element.serviceId);
        }
        });
        return this.customers.saveVendorChecks(this.getBillValues,this.userID ).subscribe((result:any)=>{
          console.log(result,'--------------------return---------------');
          if(result.outcome === true){
            Swal.fire({
              title: result.message,
              icon: 'success'
            }).then((result) => {
              if (result.isConfirmed) {
                const navURL = 'admin/addvendor';
                this.navRouter.navigate([navURL]);
              }
            });
          }else{
            Swal.fire({
              title: result.message,
              icon: 'warning'
            })
          }
        });
      }
  
  }
  
  