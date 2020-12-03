//
//  ToolBarController.swift
//  Judorange-webinspector
//
//  Created by Julien Cuénot on 03/07/2019.
//  Copyright © 2019 Julien Cuénot. All rights reserved.
//

import Foundation
import UIKit


class ToolBarController:UIViewController {
    
    // DEAL WITH PARENT VIEW CONTROLLER'ViewController' =========================
    var toolBarDelegate: ToolBarDelegate?
    // ==========================================================================
    
    // IBOutlet
    @IBOutlet weak var backButton: UIButton!
    @IBOutlet weak var forwardButton: UIButton!
    @IBOutlet weak var reloadButton: UIButton!
    @IBOutlet weak var inspectorButton: UIButton!
    
    // IBAction
    @IBAction func goBack(sender: UIButton){ toolBarDelegate!.goBack() }
    @IBAction func goForward(sender: UIButton){ toolBarDelegate!.goForward() }
    @IBAction func goReload(sender: UIButton){ toolBarDelegate!.goReload() }
    @IBAction func showOrHideInspector(sender: UIButton){ toolBarDelegate!.showOrHideInspector() }
    
    
    
    override func viewDidLoad() {   // loadView or viewDidLoad
        
        // CALL SUPER
        super.viewDidLoad()         // super.loadView or super.viewDidLoad
        
        // Disable navigation buttons on first loads
        backButton.isEnabled = false
        forwardButton.isEnabled = false
        
    }
    
    
    
} // End of class
