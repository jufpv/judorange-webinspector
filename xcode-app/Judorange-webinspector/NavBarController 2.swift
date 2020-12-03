//
//  ViewController.swift
//  web_dev_browser-v0
//
//  Created by Julien Cuénot on 07/05/2019.
//  Copyright © 2019 Julien Cuénot. All rights reserved.
//

import Foundation
import UIKit


extension UIButton{
    func roundedButton(){
        let maskPath1 = UIBezierPath(roundedRect: bounds,
                                     byRoundingCorners: [.bottomLeft , .bottomRight],
                                     cornerRadii: CGSize(width: 8, height: 8))
        let maskLayer1 = CAShapeLayer()
        maskLayer1.frame = bounds
        maskLayer1.path = maskPath1.cgPath
        layer.mask = maskLayer1
    }
}


class NavBarController:UIViewController{
    
    // DEAL WITH PARENT VIEW CONTROLLER'ViewController' =========================
    var navBarDelegate: NavBarDelegate?
    // ==========================================================================
    
    // COLORS
    var colorNavBarWhite = UIColor( red: CGFloat(255/255.0), green: CGFloat(255/255.0), blue: CGFloat(255/255.0), alpha: CGFloat(1.0) )
    var colorNavBarOrange = UIColor( red: CGFloat(225/255.0), green: CGFloat(142/255.0), blue: CGFloat(103/255.0), alpha: CGFloat(1.0) )
    var colorNavBarGrey = UIColor( red: CGFloat(35/255.0), green: CGFloat(35/255.0), blue: CGFloat(35/255.0), alpha: CGFloat(1.0) )
    var colorNavBarGreyDark = UIColor( red: CGFloat(31/255.0), green: CGFloat(33/255.0), blue: CGFloat(36/255.0), alpha: CGFloat(1.0) )
    var colorNavBarDefault = UIColor( red: CGFloat(229/255.0), green: CGFloat(229/255.0), blue: CGFloat(229/255.0), alpha: CGFloat(1.0) )
    var colorNavBarTransparent = UIColor( red: CGFloat(255/255.0), green: CGFloat(255/255.0), blue: CGFloat(255/255.0), alpha: CGFloat(0) )
    //
    
    // IBOutlet
    @IBOutlet weak var urlField: UITextField!
    @IBOutlet weak var tab1Btn: UIButton!
    @IBOutlet weak var tab2Btn: UIButton!
    @IBOutlet weak var tab3Btn: UIButton!
    @IBOutlet weak var tab4Btn: UIButton!
    
    // IBAction
    @IBAction func textFieldDidEndOnExit(textField: UITextField) {
        print("NavBarController:textFieldDidEndOnExit(textField: UITextField)")
        textField.resignFirstResponder()
        navBarDelegate?.loadUrlField()
    }
    @IBAction func goTab1(sender: UIButton) {
        print("NavBarController:goTab1(sender: UIButton)")
        currentTab = 1
        //
        tab1Btn.backgroundColor = colorNavBarTransparent
        tab2Btn.backgroundColor = colorNavBarGreyDark
        tab3Btn.backgroundColor = colorNavBarGreyDark
        tab4Btn.backgroundColor = colorNavBarGreyDark
        //
        tab1Btn.setTitleColor(colorNavBarOrange, for: .normal)
        tab2Btn.setTitleColor(colorNavBarWhite, for: .normal)
        tab3Btn.setTitleColor(colorNavBarWhite, for: .normal)
        tab4Btn.setTitleColor(colorNavBarWhite, for: .normal)
        //
        navBarDelegate!.loadTab1()
    }
    @IBAction func goTab2(sender: UIButton) {
        print("NavBarController:goTab2(sender: UIButton)")
        currentTab = 2
        //
        tab1Btn.backgroundColor = colorNavBarGreyDark
        tab2Btn.backgroundColor = colorNavBarTransparent
        tab3Btn.backgroundColor = colorNavBarGreyDark
        tab4Btn.backgroundColor = colorNavBarGreyDark
        //
        tab1Btn.setTitleColor(colorNavBarWhite, for: .normal)
        tab2Btn.setTitleColor(colorNavBarOrange, for: .normal)
        tab3Btn.setTitleColor(colorNavBarWhite, for: .normal)
        tab4Btn.setTitleColor(colorNavBarWhite, for: .normal)
        //
        navBarDelegate!.loadTab2()
    }
    @IBAction func goTab3(sender: UIButton) {
        print("NavBarController:goTab3(sender: UIButton)")
        currentTab = 3
        //
        tab1Btn.backgroundColor = colorNavBarGreyDark
        tab2Btn.backgroundColor = colorNavBarGreyDark
        tab3Btn.backgroundColor = colorNavBarTransparent
        tab4Btn.backgroundColor = colorNavBarGreyDark
        //
        tab1Btn.setTitleColor(colorNavBarWhite, for: .normal)
        tab2Btn.setTitleColor(colorNavBarWhite, for: .normal)
        tab3Btn.setTitleColor(colorNavBarOrange, for: .normal)
        tab4Btn.setTitleColor(colorNavBarWhite, for: .normal)
        //
        navBarDelegate!.loadTab3()
    }
    @IBAction func goTab4(sender: UIButton) {
        print("NavBarController:goTab4(sender: UIButton)")
        currentTab = 4
        //
        tab1Btn.backgroundColor = colorNavBarGreyDark
        tab2Btn.backgroundColor = colorNavBarGreyDark
        tab3Btn.backgroundColor = colorNavBarGreyDark
        tab4Btn.backgroundColor = colorNavBarTransparent
        //
        tab1Btn.setTitleColor(colorNavBarWhite, for: .normal)
        tab2Btn.setTitleColor(colorNavBarWhite, for: .normal)
        tab3Btn.setTitleColor(colorNavBarWhite, for: .normal)
        tab4Btn.setTitleColor(colorNavBarOrange, for: .normal)
        //
        navBarDelegate!.loadTab4()
    }
    
    // USEFULL PROPERTIES
    var currentTab = 1
    
    
    override func viewDidLoad() {   // loadView or viewDidLoad
        
        // CALL SUPER
        super.viewDidLoad()         // super.loadView or super.viewDidLoad
        
        // CUSTOMIZE SEARCH BAR URL FIELD
        urlField.textColor = UIColor.orange
        urlField.layer.cornerRadius = urlField.frame.size.height/2
        urlField.clipsToBounds = true
        urlField.layer.borderWidth = 0
        //urlField.layer.borderColor = colorNavBarOrange.cgColor //UIColor.orange.cgColor
        // CUSTOMIZE BUTTONS
        /*tab1Btn.roundedButton()
        tab2Btn.roundedButton()
        tab3Btn.roundedButton()
        tab4Btn.roundedButton()*/
        
    }
    
    
    
} // End of class





