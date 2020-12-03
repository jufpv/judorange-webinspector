//
//  ViewController.swift
//  web_dev_browser-v0
//
//  Created by Julien Cuénot on 07/05/2019.
//  Copyright © 2019 Julien Cuénot. All rights reserved.
//

import Foundation
import UIKit





class NavBarController:UIViewController{
    
    // DEAL WITH PARENT VIEW CONTROLLER'ViewController' =========================
    var navBarDelegate: NavBarDelegate?
    // ==========================================================================
    
    
    
    // IBOutlet
    @IBOutlet weak var urlField: UITextField!
    
    // IBAction
    @IBAction func textFieldDidEndOnExit(textField: UITextField) {
        print("NavBarController:textFieldDidEndOnExit(textField: UITextField)")
        textField.resignFirstResponder()
        navBarDelegate?.loadUrlField()
    }
    
    // USEFULL PROPERTIES
    var currentTab = 1
    
    
    override func viewDidLoad() {   // loadView or viewDidLoad
        
        // CALL SUPER
        super.viewDidLoad()         // super.loadView or super.viewDidLoad
        
        // CUSTOMIZE VIEW STYLE
        //view.frame = CGRect(x:0, y:0, width:100 , height:view.frame.height)
        //view.layer.borderWidth = 1;
        //view.layer.borderColor = view.backgroundColor?.cgColor
        view.backgroundColor = colorNavBar
        view.border(position: .LINE_POSITION_BOTTOM, color: colorGrey190, width: 1.0)
        view.clipsToBounds = true
        
        // CUSTOMIZE SEARCH BAR URL FIELD
        urlField.textColor = UIColor.orange
        urlField.layer.cornerRadius = urlField.frame.size.height / 4
        urlField.layer.masksToBounds = true
        urlField.backgroundColor = colorSearchField
        urlField.layer.borderWidth = 1
        urlField.layer.borderColor =  colorSearchField.cgColor
        //urlField.borderStyle = .none
        urlField.clipsToBounds = true
    }
    
    
    
} // End of class





